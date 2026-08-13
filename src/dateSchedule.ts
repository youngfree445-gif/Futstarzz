// Calendario por FECHAS REALES: qué juega un club cada día, en vez de cada semana.
//
// El motor viejo modelaba el tiempo en semanas y permitía UN partido por semana. Con eso la liga
// disponía de ~31 de las 52 semanas del año (isCupWeek se quedaba con 2 de cada 5), pero la liga
// colombiana necesita 40 fechas por año entre Apertura y Clausura. Faltaban ~9: por eso la tabla se
// congelaba y las copas no cerraban.
//
// Los datos reales lo confirman: en los 20 clubes de Colombia hay 253 semanas con 2+ partidos y
// picos de 4 (liga el domingo, Libertadores el jueves). Ninguno de esos partidos entraba.
//
// Acá la unidad es el DÍA. Cada partido está anclado a su fecha, y una misma semana puede tener
// tantos partidos como tenga en la realidad.

import { DATED_CALENDARS, type DatedCompetition, type DatedMatch } from './realCalendarDates';
import { CAREER_START_YEAR } from './leagueEngine';
import { CAREER_START_DATE, MAX_TEMPORADAS, competicionEnTemporada, partidosDePlayoff } from './seasonCalendar';
import { FECHAS_FIFA } from './fechasFifa';
import { CUPOS_CONCACAF, VENTANA_CONCACAF } from './copaConcacaf';
import { FECHAS_KNOCKOUT_POR_COPA } from './fechasConmebol';
// copaNacional sólo importa ./types, así que no hay ciclo posible en esta dirección.
import { nombreCopaNacional } from './copaNacional';

export interface DatedFixture {
  competition: DatedCompetition;
  match: DatedMatch;
  date: string;      // YYYY-MM-DD
  isHome: boolean;
  opponentName: string;
  /**
   * Temporada de carrera a la que pertenece (1 = el calendario real; 2+ = generadas).
   *
   * Hace falta porque fixturesForClub devuelve TODAS las temporadas concatenadas: sin esto, "el
   * último partido de la copa" salía ser el de 2057 en vez del de este año, y ninguna copa coronaba
   * campeón. Bug reportado: "gané ambos partidos de la Superliga y no me dijo que quedé campeón".
   */
  temporada: number;
  /**
   * Fecha RESERVADA para la copa: el día está apartado, pero el rival lo decide el cuadro del motor
   * (copaNacional.ts), no el calendario. Ver RESERVAS DE COPA más abajo.
   *
   * `opponentName` en estos casos es un cartel de relleno y no debe usarse para buscar un club.
   */
  esReservaDeCuadro?: boolean;
  /**
   * Fecha de PLAYOFF (los cuadrangulares de Colombia y Argentina), no de la fase regular.
   *
   * Importa porque estos partidos NO van a la tabla. En el Apertura 2026 el Junior jugó 25 fechas y
   * el Millonarios 19: las 6 de más son cuartos, semis y final, a ida y vuelta. Sumándolas a la
   * misma tabla, el campeón salía de comparar 25 partidos contra 19 -- y el que llegó a la final
   * quedaba arriba por haber jugado más, no por andar mejor.
   */
  esPlayoff?: boolean;
}

// Se re-exporta para no romper a los módulos que ya la importaban de acá; la definición vive en
// seasonCalendar.ts, que es de donde la toma también leagueEngine sin crear un ciclo.
export { CAREER_START_DATE };

const MS_POR_DIA = 86_400_000;

// Las dos conversiones de abajo se llaman decenas de miles de veces al armar el calendario (el
// reparto de fechas de copa recorre ventanas de meses día por día), y tanto Date.parse como
// toISOString son caros. Con memo el conjunto de valores distintos es chico -- unas 10.000 fechas
// para las 32 temporadas -- y se reusa entre clubes de la misma liga, que juegan los mismos días.
const diaPorFecha = new Map<string, number>();
const fechaPorDia = new Map<number, string>();

/** Fecha (YYYY-MM-DD) del día N de carrera. day=1 es CAREER_START_DATE. */
export function dateForDay(day: number): string {
  const cacheado = fechaPorDia.get(day);
  if (cacheado !== undefined) return cacheado;
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  const fecha = new Date(base + (day - 1) * MS_POR_DIA).toISOString().slice(0, 10);
  fechaPorDia.set(day, fecha);
  return fecha;
}

/** Día de carrera de una fecha. Inverso de dateForDay. */
export function dayForDate(date: string): number {
  const cacheado = diaPorFecha.get(date);
  if (cacheado !== undefined) return cacheado;
  const base = Date.parse(`${CAREER_START_DATE}T00:00:00Z`);
  const dia = Math.round((Date.parse(`${date}T00:00:00Z`) - base) / MS_POR_DIA) + 1;
  diaPorFecha.set(date, dia);
  return dia;
}

// --- CUÁNDO ARRANCA LA CARRERA, SEGÚN DÓNDE JUEGUES ------------------------------------------
//
// No hay una sola fecha de inicio, porque no hay una sola temporada. Medido sobre las 28 ligas
// cargadas:
//
//   agosto     Alemania, Inglaterra, España, Italia, Francia, Holanda, Portugal
//   enero-abr  Colombia, Argentina, Brasil, Chile, Perú, Paraguay, Venezuela, Uruguay,
//              Ecuador, Bolivia
//   febrero    MLS          julio    Liga MX
//
// Con una fecha global (12 de enero de 2026) el europeo agarraba su temporada por la mitad: el
// Barcelona jugaba 19 fechas de LaLiga en la temporada 1 en vez de 38, y el mexicano esperaba seis
// meses sentado. Ahora cada club arranca cuando arranca SU liga, y todos juegan su primera
// temporada entera.
const cacheInicio = new Map<string, string>();

/**
 * El día en que empieza la carrera para este club: el primer partido de su liga.
 *
 * Sale del calendario, no de una tabla de países: si mañana se carga una liga que arranca en
 * octubre, funciona sin tocar nada.
 */
export function inicioDeCarrera(clubName: string): string {
  const cacheado = cacheInicio.get(clubName);
  if (cacheado) return cacheado;

  let primera = '';
  for (const comp of DATED_CALENDARS) {
    if (comp.kind !== 'league' || !comp.firstDate) continue;
    if (!comp.matches.some(m => m.home === clubName || m.away === clubName)) continue;
    if (!primera || comp.firstDate < primera) primera = comp.firstDate;
  }
  const r = primera || CAREER_START_DATE;
  cacheInicio.set(clubName, r);
  return r;
}

// Índice club -> partidos de UNA temporada, ordenados por fecha. Se cachea por temporada: recorrer
// los 7808 partidos en cada avance de día se nota en móvil.
const indicePorTemporada = new Map<number, Map<string, DatedFixture[]>>();

function getIndice(temporada = 1): Map<string, DatedFixture[]> {
  const cacheado = indicePorTemporada.get(temporada);
  if (cacheado) return cacheado;

  const indice = new Map<string, DatedFixture[]>();
  const agregar = (club: string, fx: DatedFixture) => {
    const lista = indice.get(club);
    if (lista) lista.push(fx);
    else indice.set(club, [fx]);
  };

  // Las copas que corren por cuadro se juntan acá y se resuelven en una SEGUNDA pasada: para
  // reservarle fechas a un club hay que saber primero qué días tiene ya ocupados.
  const conCuadro: DatedCompetition[] = [];
  // Las copas CONTINENTALES también reservan, en una pasada aparte y después de las nacionales.
  //
  // Antes no reservaban ninguna y por eso la Libertadores se quedaba sin fechas: lo único que tenía
  // era el fragmento scrapeado -- la fase de grupos -- y el cuadro no tenía dónde jugar octavos en
  // adelante. Peor todavía en los países SIN copa nacional modelada (Perú, Paraguay): ahí no corría
  // ninguna pasada de reservas, así que sus clubes tenían CERO días de copa en todo el año.
  const continentales: DatedCompetition[] = [];
  // Competiciones cuyas fechas hay que reubicar para que entren sin pisar nada.
  const aAcomodar: DatedCompetition[] = [];
  /** Las ligas de la temporada, para reservarles despues sus fechas de cuadrangular. */
  const deLiga: DatedCompetition[] = [];

  for (const original of DATED_CALENDARS) {
    // De la temporada 2 en adelante, las COPAS no salen del calendario: las arma el cuadro del
    // motor (copaNacional.ts y getOrCreateCupState).
    //
    // El generador de temporadas permuta los clubes del calendario real y le corre las fechas un
    // año. Para una LIGA eso es perfecto: la estructura del round-robin se conserva intacta --
    // medido, 380 partidos, 38 por club y cada par exactamente dos veces, en la temporada 1, la 2
    // y la 5.
    //
    // Para una copa de eliminación no significa nada. El calendario real de una copa es una foto
    // PARCIAL (sólo las rondas ya sorteadas al scrapear) y además su forma la decidieron los
    // resultados de ese año: quién llegó a la final jugó cinco partidos y el eliminado en primera
    // ronda, uno. Al permutar nombres sobre esa forma, el club al que le toca el lugar del
    // finalista juega cinco partidos TODAS las temporadas y el que hereda el lugar del eliminado
    // juega uno, sin importar qué tan bueno sea. Medido en la Copa do Brasil: 46 partidos y entre
    // 1 y 5 por club, idéntico en las temporadas 1, 2 y 5. No es una copa, es un fragmento
    // congelado repartido al azar -- sin final y sin campeón posible.
    //
    // REVERTIDO (11 ago 2026). Acá se filtraban las copas desde la temporada 2 para que las armara
    // el cuadro del motor, y el efecto real fue dejar a esos clubes SIN copas.
    //
    // El motivo: fixturesAtStep mapea el paso N a la N-ésima FECHA del club, corrido entre
    // temporadas, así que un club con calendario real tiene partido en todos los pasos. Medido en
    // la temporada 2: 52 pasos, 52 con liga, 0 libres. La rama que ofrece el partido del cuadro
    // exige `!datedPrimary` -- que nunca se cumple -- así que el bracket no llegaba a jugar nunca.
    //
    // El arreglo de verdad no es filtrar: es RESERVARLES fechas en el calendario, para que liga y
    // copa corran por el mismo reloj y pickPrimary elija entre las dos cuando caen el mismo día
    // (que es exactamente como funciona la temporada 1). Es lo que hace la segunda pasada de abajo.
    const comp = competicionEnTemporada(original, temporada);

    // Su fragmento real se emite igual (los partidos de grupos son de Transfermarkt); lo que se
    // agrega en la segunda pasada son las fechas para CONTINUAR el torneo cuando se acaba.
    if (original.kind === 'continental_cup') continentales.push(comp);

    if (usaCuadroDelMotor(original)) {
      conCuadro.push(comp);
      // Temporada 1: los partidos de copa REALES se juegan igual -- rival, ronda y fecha salen de
      // Transfermarkt, y esa es la mejor materia prima que hay. Lo que se agrega después son las
      // fechas para CONTINUAR el torneo cuando el fragmento scrapeado se acaba.
      // Temporada 2+: no hay nada real que conservar (la permutación repartía un fragmento
      // congelado), así que la copa entera sale del cuadro.
      //
      if (temporada !== 1) continue;

      // Copa cuyas fechas vienen de otra temporada: chocan con la liga si se ponen tal cual. NO se
      // descartan -- se ACOMODAN más abajo, corriendo cada partido al día libre más cercano. Es lo
      // que hacen las ligas de verdad cuando dos torneos se superponen: se reprograma, no se
      // borra. Antes acá se tiraban y el torneo se rearmaba con días reservados, que es lo mismo
      // que perder los rivales y las rondas reales.
      if (original.soloReservas) { aAcomodar.push(comp); continue; }
    }

    // Los playoffs se marcan ACÁ, al crear el fixture, y no en una pasada aparte: recorrer los
    // ~8000 partidos de las 32 temporadas una segunda vez armando la clave de cada uno llevó el
    // armado del calendario de 545 a 762 ms, por encima del tope. Lo agarró el validador.
    if (comp.kind === 'league') deLiga.push(comp);
    const playoffs = original.kind === 'league' ? partidosDePlayoff(original) : null;

    for (let i = 0; i < comp.matches.length; i++) {
      const match = comp.matches[i];
      // En la temporada 1 se descartan las fechas anteriores al arranque de la carrera (media
      // temporada europea ya jugada). De la 2 en adelante todas las fechas son futuras.
      const esPlayoff = playoffs?.has(i) || undefined;
      // El corte de "antes de que empezara la carrera" es POR CLUB: un club español arranca en
      // agosto y uno colombiano en enero, así que la misma fecha puede ser pasado para uno y
      // futuro para el otro.
      if (temporada !== 1 || match.date >= inicioDeCarrera(match.home)) {
        agregar(match.home, { competition: comp, match, date: match.date, isHome: true, opponentName: match.away, temporada, esPlayoff });
      }
      if (temporada !== 1 || match.date >= inicioDeCarrera(match.away)) {
        agregar(match.away, { competition: comp, match, date: match.date, isHome: false, opponentName: match.home, temporada, esPlayoff });
      }
    }
  }
  // Las reservas se calculan ANTES de ordenar y se ordena una sola vez al final: ordenar el índice
  // entero dos veces por temporada, con 32 temporadas, se nota al abrir el juego.
  acomodarFechas(aAcomodar, temporada, indice, agregar);
  // La CONTINENTAL va primero, y el orden importa.
  //
  // Sus fechas son FIJAS -- octavos el 13 de agosto, la final el 29 de noviembre -- mientras que las
  // de la copa nacional se pueden acomodar en cualquier hueco. Con la nacional primero, la bolsa
  // compartida se agotaba antes de llegar acá: al Junior le quedaban 2 dias para toda la
  // Libertadores, y las fechas reales del knockout no entraban ni una.
  for (const comp of continentales) reservarFechasDeCopa(comp, temporada, indice, agregar);
  for (const comp of conCuadro) reservarFechasDeCopa(comp, temporada, indice, agregar);
  for (const comp of deLiga) reservarFechasDeCuadrangular(comp, temporada, indice, agregar);
  reservarFechasDeMundial(indice, temporada);
  reservarFechasFifa(indice, temporada);
  for (const lista of indice.values()) lista.sort((a, b) => a.date.localeCompare(b.date));

  indicePorTemporada.set(temporada, indice);
  return indice;
}

/** Cuartos, semis y final del cuadrangular, todo a ida y vuelta. */
const FECHAS_DE_CUADRANGULAR = 6;

/**
 * Los cuadrangulares del semestre que no los trae scrapeados.
 *
 * En Colombia y Argentina cada semestre se define con un cuadro de ocho, no con la tabla. El
 * calendario real trae los del Apertura -- se detectan solos, porque los que llegan lejos juegan más
 * partidos que el resto (ver partidosDePlayoff) -- pero el Clausura se scrapeó cuando todavía no se
 * habían jugado, así que sus 19 fechas son todas de fase regular y no hay de dónde deducir nada.
 * Resultado: el Clausura coronaba campeón al primero de la tabla, que en Colombia no es campeón de
 * nada. Encontrado jugando una temporada entera con el Junior.
 *
 * Los días se apartan igual que los de copa: el calendario pone el DÍA y el cuadro pone el RIVAL
 * (ver prepararPlayoffDeLiga, que siembra con los ocho primeros de la tabla). Se le reservan a todos
 * los clubes de la liga porque el calendario es una función pura del nombre del club y no puede
 * saber quién va a clasificar; al que no entre al cuadro, esos días le quedan de descanso -- que es
 * exactamente lo que le pasa a un club que no clasificó.
 */
function reservarFechasDeCuadrangular(
  comp: DatedCompetition,
  temporada: number,
  indice: Map<string, DatedFixture[]>,
  agregar: (club: string, fx: DatedFixture) => void,
) {
  if (!esCalendarioDeDosTorneos(comp)) return;

  // LOS DÍAS QUE LA LIGA YA RESERVÓ PARA CUADRANGULARES, por torneo.
  //
  // Al club que no clasificó en la vida real no hay que inventarle fechas: la liga ya dijo cuáles
  // son. Los que sí clasificaron las tienen scrapeadas (del 10 de mayo al 8 de junio, en el Apertura
  // 2026), y ésas son las buenas -- son los días en que la Dimayor paró la fase regular justamente
  // para jugar el cuadro. Reusarlas sale gratis en descanso, porque en esos días el club que no
  // clasificó no juega nada.
  //
  // La alternativa que probé primero -- generar días nuevos después del cierre del semestre -- caía
  // justo en el parón del Mundial, que es lo que ocupa el hueco entre Apertura y Clausura: nueve
  // fechas de selección entre el 11 de junio y el 13 de julio. Los tramos de 4 partidos en 7 días de
  // la Dimayor pasaban de 21 a 95.
  const diasRealesPorTorneo = new Map<string, string[]>();
  for (const i of partidosDePlayoff(comp)) {
    const m = comp.matches[i];
    const t = torneoDeFecha(comp, m.date);
    const lista = diasRealesPorTorneo.get(t);
    if (lista) { if (!lista.includes(m.date)) lista.push(m.date); }
    else diasRealesPorTorneo.set(t, [m.date]);
  }
  for (const lista of diasRealesPorTorneo.values()) lista.sort();

  for (const club of clubesDelPais(comp)) {
    const propios = indice.get(club) ?? [];
    const suyosDeLiga = propios.filter(f => f.competition.id === comp.id);
    if (!suyosDeLiga.length) continue;

    // Los días ocupados y sus alrededores se calculan UNA vez por club, no por torneo.
    const ocupados = new Set<number>();
    const vetados = new Set<number>();
    for (const f of propios) {
      const dia = dayForDate(f.date);
      ocupados.add(dia);
      for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
    }

    const porTorneo = new Map<string, DatedFixture[]>();
    for (const f of suyosDeLiga) {
      const t = torneoDeFecha(comp, f.date);
      const lista = porTorneo.get(t);
      if (lista) lista.push(f); else porTorneo.set(t, [f]);
    }

    for (const [torneoDelSemestre, fs] of porTorneo) {
      // Ya tiene cuadrangular de verdad (el Apertura): no se le inventa uno encima.
      if (fs.some(f => f.esPlayoff)) continue;
      // Un club con cuatro fechas sueltas del semestre no jugó ese torneo: no hay nada que definir.
      if (fs.length < 8) continue;

      const ponerEn = (dia: number) => {
        const date = dateForDay(dia);
        // El cuadrangular del Apertura no puede caer en julio. torneoDeFecha parte el año por mes, y
        // un día pasado el corte queda contado como del OTRO torneo: al Millonarios le apareció una
        // fecha de "cuadrangular del Clausura" el 21 de julio, antes de que el Clausura empezara.
        if (torneoDeFecha(comp, date) !== torneoDelSemestre) return;
        agregar(club, {
          competition: comp,
          match: { date, home: club, away: RIVAL_POR_SORTEAR },
          date, isHome: true, opponentName: RIVAL_POR_SORTEAR, temporada, esPlayoff: true,
        });
        ocupados.add(dia);
        for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
      };

      // Camino bueno: el semestre YA tiene días de cuadrangular en el calendario real.
      const reales = diasRealesPorTorneo.get(torneoDelSemestre);
      if (reales?.length) {
        // Se recorren de atrás para adelante -- las rondas hondas primero, que son las que no se
        // pueden perder -- y se descartan los días pegados a otro partido. La lista real trae los
        // días de TODOS los cruces del semestre, así que hay varios seguidos: al Millonarios le
        // tocaban el 16 y el 17 de mayo, dos partidos en dos días. El veto los separa.
        const elegidas: number[] = [];
        for (let i = reales.length - 1; i >= 0 && elegidas.length < FECHAS_DE_CUADRANGULAR; i--) {
          const dia = dayForDate(reales[i]);
          if (ocupados.has(dia) || vetados.has(dia)) continue;
          elegidas.push(dia);
          for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
        }
        for (const dia of elegidas.sort((a, b) => a - b)) ponerEn(dia);

        // Si el veto dejó afuera casi todos los días reales -- pasa cuando las reservas de copa ya
        // se llevaron esa ventana, que es el caso del Millonarios -- se COMPLETA con días nuevos
        // dentro del mismo tramo. No se abandona: el semestre se define en cancha o no se define.
        const faltan = FECHAS_DE_CUADRANGULAR - elegidas.length;
        if (faltan > 0) {
          const primero = dayForDate(reales[0]);
          const ultimoReal = dayForDate(reales[reales.length - 1]);
          // Ventana ancha a propósito: apretados en el tramo real salían seis partidos en trece días
          // (al Millonarios le tocaba uno cada dos). El techo es el arranque del OTRO torneo, que es
          // el límite de verdad -- más allá, el cuadrangular pisaría el semestre siguiente.
          // El techo se CLAVA en el fin del semestre, no se filtra al colocar: elegirDias devuelve
          // exactamente lo que se le pide, así que si después se descartaban los días que se pasaban
          // de junio, el club terminaba con dos fechas de cuadrangular en vez de seis.
          const anio = Number(reales[0].slice(0, 4));
          const finDelSemestre = dayForDate(`${anio}-${torneoDelSemestre === 'Apertura' ? '06-30' : '12-31'}`);
          for (const dia of elegirDias(primero, Math.min(finDelSemestre, ultimoReal + 45), vetados, faltan, ocupados)) ponerEn(dia);
        }
        continue;
      }

      const ultimo = dayForDate(fs[fs.length - 1].date);
      // Arranca una semana después del cierre de la fase regular, como en la vida real, y tiene un
      // mes y medio para las tres rondas. El techo no puede pisar el arranque del OTRO torneo: si
      // lo hiciera, la primera fecha del Apertura siguiente caería en medio de la final anterior.
      const siguiente = suyosDeLiga.find(f => dayForDate(f.date) > ultimo + 3);
      const techo = siguiente ? dayForDate(siguiente.date) - 3 : ultimo + 48;
      const desde = ultimo + 7;
      const hasta = Math.min(techo, ultimo + 48);
      if (hasta <= desde) continue;

      // El cuadrangular se INVENTA -- no viene del calendario real -- así que sólo se agrega si hay
      // lugar de verdad. La regla de "acomodar y nunca quitar" protege a los partidos que TIENEN que
      // existir; meter a la fuerza un torneo que nadie jugó, encima de un hueco que ya está ocupado,
      // es lo contrario de eso.
      //
      // El caso concreto: el hueco entre el Apertura y el Clausura es, justamente, el parón del
      // Mundial -- nueve fechas de selección entre el 11 de junio y el 13 de julio. Forzando ahí las
      // seis fechas del cuadrangular, los tramos de 4 partidos en 7 días de la Dimayor pasaban de 21
      // a 95. Con este corte se agregan sólo donde el semestre deja aire, que es el Clausura.
      // Camino de respaldo: el semestre NO tiene ningún día de cuadrangular en el calendario real.
      // Es el caso del Clausura, que se scrapeó antes de que se jugaran. Acá sí se generan, y se
      // generan SIEMPRE: el torneo tiene que definirse en cancha aunque el hueco venga apretado.
      // No es el caso del Mundial -- ese hueco cae entre semestres, no después del último --, así
      // que acá no hay nada con qué chocar: el Clausura cierra el 8 de noviembre y el año sigue.
      for (const dia of elegirDias(desde, hasta, vetados, FECHAS_DE_CUADRANGULAR, ocupados)) ponerEn(dia);
    }
  }
}

// --- RESERVAS DE COPA -------------------------------------------------------------------------
//
// El calendario real de una copa nacional no es un torneo: es un FRAGMENTO. Sólo trae las rondas
// que ya estaban sorteadas el día que se scrapeó, y su forma la decidieron los resultados de ese
// año. Medido en la Copa do Brasil: 46 partidos entre 33 clubes, de 1 a 5 por club. En la Copa del
// Rey, 12 partidos entre 16 clubes.
//
// De ahí salían dos cosas que el jugador reportó:
//   - La copa se terminaba sola: "gané esos partidos de la Copa do Brasil pero en el calendario
//     jamás salió mi siguiente rival".
//   - Nadie salía campeón nunca. Medido antes de este cambio con `npm run validar:copas`:
//     0 de 12 ediciones coronaron a alguien, en cuatro países distintos.
//
// El motor SÍ tiene un cuadro de verdad (copaNacional.ts): los clubes del país, ida y vuelta,
// eliminación real y campeón. Nunca llegaba a usarse, porque fixturesAtStep numera los pasos por
// FECHA CON PARTIDO -- un club con calendario real tiene partido en TODOS los pasos -- y la rama de
// App.tsx que ofrece el cuadro exigía un paso libre que no existía jamás.
//
// La salida no es sacar la copa del calendario: eso ya se intentó (ver el comentario largo de
// arriba) y dejó a los clubes sin ninguna copa. Es al revés. El calendario le RESERVA días a la
// copa; el cuadro decide contra quién se juega. Cada pregunta con una sola fuente, y las dos
// corriendo por el mismo reloj.

/**
 * Fechas de copa que se le apartan a cada club por temporada.
 *
 * Es UNA SOLA BOLSA para todas las copas, no una por torneo. El día queda apartado y, cuando llega,
 * el juego pregunta en orden: ¿tengo partido de copa continental? ¿y de copa nacional? ¿no? entonces
 * descanso. Es como funciona de verdad -- el miércoles es de copa, la que te toque -- y evita el
 * problema de tener que adivinar de antemano a qué torneo pertenece cada día, que es imposible:
 * quién juega la Libertadores depende de cómo terminó la tabla del año anterior, y el calendario es
 * una función pura del nombre del club.
 *
 * Base 12: alcanza para un cuadro nacional de 32 (5 rondas de ida y vuelta = 10) más holgura.
 */
const FECHAS_DE_COPA_BASE = 12;

/** Radio en días para medir si una fecha nueva queda apretada contra las que ya hay. */
const VENTANA_DE_DESCANSO_DIAS = 3;

/**
 * Las de más para los clubes cuyo país juega copas continentales.
 *
 * Una Libertadores son 6 fechas de grupo más 4 de eliminación; una Champions, 8 de fase de liga más
 * el playoff y cuatro rondas de ida y vuelta. Con la bolsa base sola, un club que juega las dos
 * copas se quedaba sin fechas para la nacional -- o al revés.
 *
 * Los clubes de esos países que NO clasifican ese año no pierden nada: sus fechas sobrantes son
 * días de descanso, que es exactamente lo que le pasa a un club sin copa internacional.
 */
const FECHAS_DE_COPA_CONTINENTAL = 14;

/**
 * Los clubes que pueden llegar a jugar una copa continental, y por eso necesitan la bolsa grande.
 *
 * Se decide por COMPETICIÓN de liga, no por país: la Serie A italiana pone clubes en la Champions
 * y la Serie B no, aunque las dos sean "Italiana". Preguntando por país, Sampdoria -- que sólo
 * juega la Coppa -- se llevaba 22 fechas de copa para una temporada de 18 partidos de liga: doce
 * días de descanso inventados en el medio.
 *
 * Alcanza con que UN club de esa competición aparezca en una copa continental. No se pregunta club
 * por club a propósito: quién clasifica depende de la tabla del año anterior, así que cualquier
 * club de Primera puede terminar jugándola. Los que no clasifican ese año usan esas fechas para la
 * copa nacional, y lo que sobre queda como descanso.
 */
let cacheVentanaContinental: Map<string, { id: string; desde: string; hasta: string }> | null = null;

/**
 * Para cada club que puede jugar una copa continental, la VENTANA de esa copa.
 *
 * No alcanza con saber que el club tiene bono: hay que saber entre qué fechas se juega su copa, y
 * no es la misma para todos. La Libertadores va de febrero a noviembre y la Champions de septiembre
 * a mayo, así que un piso o un techo únicos le quedan mal a la mitad del mundo.
 *
 * La copa se le asigna a la LIGA, no al club: quién clasifica depende de la tabla del año anterior,
 * y el calendario tiene que ser una función pura del nombre del club. Si algún club de esa liga
 * aparece en una copa continental, toda la liga usa esa ventana. Los que no clasifican ese año no
 * pierden nada: sus fechas sobrantes quedan como días de descanso.
 */
function ventanaContinentalPorClub(): Map<string, { id: string; desde: string; hasta: string }> {
  if (cacheVentanaContinental) return cacheVentanaContinental;

  const copaDelClub = new Map<string, DatedCompetition>();
  for (const c of DATED_CALENDARS) {
    if (c.kind !== 'continental_cup' || !c.firstDate || !c.lastDate) continue;
    for (const m of c.matches) { copaDelClub.set(m.home, c); copaDelClub.set(m.away, c); }
  }

  const out = new Map<string, { id: string; desde: string; hasta: string }>();
  for (const c of DATED_CALENDARS) {
    if (c.kind !== 'league') continue;
    const suyos: string[] = [];
    let copa: DatedCompetition | undefined;
    for (const m of c.matches) {
      suyos.push(m.home, m.away);
      copa = copa ?? copaDelClub.get(m.home) ?? copaDelClub.get(m.away);
    }
    if (!copa) continue;
    // El fragmento de la Conmebol se corta en agosto (era lo que había sorteado el día del scrapeo)
    // pero el torneo se define en noviembre: el techo es el más lejano de los dos.
    const finReal = `${copa.lastDate!.slice(0, 4)}-${FIN_REAL_DE_COPA_CONTINENTAL}`;
    const ventana = { id: copa.id, desde: copa.firstDate!, hasta: copa.lastDate! > finReal ? copa.lastDate! : finReal };
    for (const n of suyos) out.set(n, ventana);
  }
  // --- Concacaf ---------------------------------------------------------------------------------
  //
  // México y Estados Unidos no aparecen en ninguna copa continental scrapeada -- el calendario de la
  // Concacaf Champions Cup no está en el repo -- así que por el camino de arriba se quedaban sin
  // ventana y, por lo tanto, sin un solo día de copa continental en todo el año. Eran los dos únicos
  // países con liga y copa nacional completas que figuraban como incompletos.
  //
  // La ventana es la real del torneo (4 de febrero a 1 de junio) y está declarada en copaConcacaf.ts
  // junto al resto de su formato.
  const anioBase = CAREER_START_DATE.slice(0, 4);
  for (const c of DATED_CALENDARS) {
    if (c.kind !== 'league' || !CUPOS_CONCACAF[c.league ?? '']) continue;
    for (const m of c.matches) {
      for (const club of [m.home, m.away]) {
        if (!out.has(club)) {
          out.set(club, {
            id: 'concacaf',
            desde: `${anioBase}-${VENTANA_CONCACAF.desde}`,
            hasta: `${anioBase}-${VENTANA_CONCACAF.hasta}`,
          });
        }
      }
    }
  }

  cacheVentanaContinental = out;
  return out;
}

// Cacheado y no `new Set(...keys())` en cada llamada: fechasDeCopaReservadas pregunta una vez por
// club por temporada, y rearmar el set ahí adentro se lleva puesto el tope de armado del calendario.
let cacheClubesConBono: Set<string> | null = null;

function clubesConBonoContinental(): Set<string> {
  cacheClubesConBono ??= new Set(ventanaContinentalPorClub().keys());
  return cacheClubesConBono;
}

function fechasDeCopaReservadas(club: string): number {
  return FECHAS_DE_COPA_BASE
    + (clubesConBonoContinental().has(club) ? FECHAS_DE_COPA_CONTINENTAL : 0);
}

/**
 * Cuántos días necesita ESTA competición para llegar hasta su final.
 *
 * Un cuadro de eliminación directa no admite negociación: 32 clubes son 5 rondas, y a ida y vuelta
 * eso son 10 días. Si se le dan 8, el torneo se congela en semifinales y desaparece del calendario
 * con el jugador adentro -- que es exactamente lo que pasaba (ver el comentario de `faltan`).
 *
 * Se pide el número entero del torneo, no "lo que sobre": los días que ya trae el fragmento real se
 * descuentan en el llamador, y de los que se reservan de más no se pierde nada -- un día de copa sin
 * partido es un día de descanso, que es lo que le pasa a cualquier club eliminado.
 */
function fechasQueNecesita(comp: DatedCompetition): number {
  return comp.kind === 'continental_cup' ? FECHAS_DE_COPA_CONTINENTAL : FECHAS_DE_COPA_BASE;
}

/**
 * Cuándo termina DE VERDAD una copa continental, más allá de lo que llegó a scrapearse.
 *
 * El calendario trae la Libertadores hasta el 19 de agosto y la Sudamericana hasta el 20: eso es la
 * fase de grupos y poco más, porque el día que se bajaron los datos el sorteo de octavos todavía no
 * existía. El torneo de verdad se define a fines de noviembre.
 *
 * Importa porque la bolsa de días de copa es UNA SOLA para las dos copas del club, y su techo era la
 * ventana de la copa NACIONAL -- la Copa BetPlay termina el 18 de agosto. Resultado medido en el
 * Junior: 3 días libres después de la fase de grupos, cuando el cuadro necesita 8 para llegar a la
 * final. La Libertadores se quedaba literalmente sin fechas donde jugarse.
 *
 * Es el mismo caso que las copas nacionales ("el calendario real no es un torneo: es un FRAGMENTO")
 * y se resuelve igual: mientras el fragmento tiene partidos, mandan sus fechas y sus rivales; de ahí
 * en adelante manda la ventana real del torneo.
 */
const FIN_REAL_DE_COPA_CONTINENTAL = '11-28';

/** La misma fecha, `anios` años después. El 29/2 cae en 28/2 los años no bisiestos. */
function sumarAniosADia(date: string, anios: number): string {
  if (!anios) return date;
  const [a, m, d] = date.split('-').map(Number);
  const anio = a + anios;
  const ultimo = new Date(Date.UTC(anio, m, 0)).getUTCDate();
  return `${anio}-${String(m).padStart(2, '0')}-${String(Math.min(d, ultimo)).padStart(2, '0')}`;
}

/** Días mínimos entre una fecha de copa y cualquier otro partido del club. */
const DESCANSO_MINIMO_DIAS = 3;

/**
 * Días entre una fecha de copa y la siguiente. Se prueban de mayor a menor: lo natural es que una
 * ida y su vuelta estén a una semana, pero un club europeo con liga + Champions casi no tiene
 * huecos, y ahí vale más apretar el torneo que dejarlo sin terminar. Medido en el Manchester City
 * de la temporada 1 (que arranca en enero, a media temporada): con 7 días fijos entraban 4 fechas
 * de FA Cup y el cuadro necesita 6.
 */
const ESPACIADOS_DE_COPA_DIAS = [7, 5, 4, 3];

/** Cartel del rival en una fecha reservada. No es un club: el cuadro todavía no sorteó el cruce. */
export const RIVAL_POR_SORTEAR = 'Por definir';

/**
 * ¿Esta copa la tiene que armar el cuadro del motor en vez del calendario?
 *
 * El síntoma de un fragmento es que los clubes no juegan la misma cantidad de partidos: el que
 * heredó el lugar del finalista tiene cinco y el del eliminado en primera ronda, uno. Un torneo de
 * verdad cargado entero no se ve así.
 *
 * La Superliga de Colombia queda afuera y debe quedar afuera: son 2 clubes y 2 partidos, o sea la
 * final de ida y vuelta COMPLETA. No hay nada que generar ahí.
 *
 * Y se exige que sea LA copa nacional del país, la que el motor modela (nombreCopaNacional). En
 * Inglaterra hay dos en el calendario, FA Cup y EFL Cup, pero un solo cuadro: sin este filtro las
 * dos se repartían las fechas reservadas contra el mismo bracket -- medido, la EFL se quedaba con
 * las 12 del Manchester City y la FA Cup con ninguna -- y encima el partido de una salía rotulado
 * con el nombre de la otra. La segunda copa se queda como estaba: imperfecta, pero suya.
 */
const cacheUsaCuadro = new Map<string, boolean>();

function usaCuadroDelMotor(comp: DatedCompetition): boolean {
  const cacheado = cacheUsaCuadro.get(comp.id);
  if (cacheado !== undefined) return cacheado;

  let r = false;
  // Una copa marcada soloReservas siempre corre por cuadro: su calendario es de otra temporada y
  // está ahí sólo para decir que el torneo existe.
  if (comp.soloReservas && comp.kind === 'domestic_cup') r = true;
  else if (comp.kind === 'domestic_cup' && !!comp.league && comp.name === nombreCopaNacional(comp.league)) {
    const porClub = new Map<string, number>();
    for (const m of comp.matches) {
      porClub.set(m.home, (porClub.get(m.home) ?? 0) + 1);
      porClub.set(m.away, (porClub.get(m.away) ?? 0) + 1);
    }
    const cuentas = [...porClub.values()];
    // Menos de 4 clubes no es un cuadro con rondas, es una final: se deja como está.
    r = cuentas.length >= 4 && Math.min(...cuentas) !== Math.max(...cuentas);
  }
  cacheUsaCuadro.set(comp.id, r);
  return r;
}

/**
 * Los clubes a los que hay que reservarles fechas de esta copa.
 *
 * No alcanza con los que aparecen en el fragmento scrapeado: el cuadro del motor se arma con los
 * clubes del PAÍS, y la Copa del Rey real sólo trae 16 nombres de los ~40 españoles que hay en la
 * base. Un club que entra al cuadro pero no figura en el fragmento se quedaría sin ninguna fecha
 * reservada -- o sea, sin copa, que es justo el bug que esto viene a arreglar.
 */
const cacheClubesDelPais = new Map<string, string[]>();

function clubesDelPais(comp: DatedCompetition): string[] {
  const cacheado = cacheClubesDelPais.get(comp.id);
  if (cacheado) return cacheado;

  // Una copa continental no tiene país: sus candidatos son los clubes de las LIGAS que la
  // alimentan, no los que aparecen en el fragmento scrapeado. Quién clasifica cada año lo decide la
  // tabla del año anterior, así que reservar sólo para los 32 del fragmento dejaría sin fechas a
  // cualquiera que se clasifique de la temporada 2 en adelante.
  if (comp.kind === 'continental_cup') {
    const suyos: string[] = [];
    for (const [club, v] of ventanaContinentalPorClub()) if (v.id === comp.id) suyos.push(club);
    cacheClubesDelPais.set(comp.id, suyos);
    return suyos;
  }

  const set = new Set<string>();
  for (const otra of DATED_CALENDARS) {
    const mismaCopa = otra.id === comp.id;
    const mismoPais = !!comp.league && otra.league === comp.league;
    if (!mismaCopa && !mismoPais) continue;
    for (const m of otra.matches) { set.add(m.home); set.add(m.away); }
  }
  const lista = [...set];
  cacheClubesDelPais.set(comp.id, lista);
  return lista;
}

/**
 * Le aparta a cada club del país sus días de copa en esta temporada.
 *
 * Las fechas se eligen POR CLUB, no una grilla común: si se le pusiera a todo el país el mismo día,
 * chocaría con la fecha de liga de la mitad de ellos y pickPrimary -- que le da prioridad a la copa
 * -- se comería ese partido de liga. Al elegirlas contra el calendario propio de cada club, no se
 * pisa nada. Que dos clubes de la misma llave las tengan en días distintos no se nota: el jugador
 * sólo ve su propio calendario, y el resto de las llaves las simula el motor en el mismo paso.
 */
/**
 * Mete TODOS los partidos de una competición en el calendario, corriéndolos de día si hace falta.
 *
 * El caso son las copas cuyo calendario viene de otra temporada -- la Copa MX cargada es de 2018,
 * la Copa Chile de 2025 -- y que al alinearlas con la carrera caen encima de la liga: medido, 23
 * choques de menos de dos días entre Copa MX y Liga MX.
 *
 * Antes esos partidos se DESCARTABAN y el torneo se rearmaba con días reservados. Eso perdía lo
 * único valioso que traía el archivo: los rivales y las rondas de verdad. Acá se hace lo que hacen
 * las ligas cuando dos torneos se superponen -- se REPROGRAMA. Ningún partido se pierde y ninguno
 * se inventa; sólo cambian de día.
 *
 * Se busca desde el día original hacia AFUERA, probando primero hacia adelante: un partido que no
 * entra se aplaza, no se adelanta. El día tiene que quedar libre para LOS DOS clubes, contando el
 * descanso mínimo, y sin salirse de la temporada de ninguno de los dos.
 */
function acomodarFechas(
  comps: DatedCompetition[],
  temporada: number,
  indice: Map<string, DatedFixture[]>,
  agregar: (club: string, fx: DatedFixture) => void,
) {
  if (!comps.length) return;
  const margen = DESCANSO_MINIMO_DIAS - 1;

  // Días bloqueados por club: los que ya juega, más el descanso alrededor.
  const bloqueados = new Map<string, Set<number>>();
  const ventana = new Map<string, { desde: number; hasta: number }>();
  const bloquear = (club: string, dia: number) => {
    let dias = bloqueados.get(club);
    if (!dias) { dias = new Set(); bloqueados.set(club, dias); }
    for (let k = -margen; k <= margen; k++) dias.add(dia + k);
  };

  for (const [club, fixtures] of indice) {
    if (!fixtures.length) continue;
    let min = Infinity, max = -Infinity;
    for (const f of fixtures) {
      const d = dayForDate(f.date);
      bloquear(club, d);
      if (d < min) min = d;
      if (d > max) max = d;
    }
    ventana.set(club, { desde: min, hasta: max });
  }

  const libre = (club: string, dia: number) => !bloqueados.get(club)?.has(dia);
  /** ¿Entra en la temporada de ese club? Un club sin partidos todavía acepta cualquier día. */
  const dentroDeSuTemporada = (club: string, dia: number) => {
    const v = ventana.get(club);
    return !v || (dia >= v.desde && dia <= v.hasta);
  };

  const MAX_CORRIMIENTO_DIAS = 45;

  // La ventana de cada torneo, tomada de su propio calendario. Un partido se puede correr de día,
  // pero no salirse del torneo: la Copa Chile va de enero a diciembre y la Coupe de France de
  // noviembre a mayo, y mover una final fuera de eso deja de ser reprogramar. Las ventanas están
  // escritas en docs/VENTANAS_DE_COMPETICIONES.md.
  const ventanaDelTorneo = new Map<string, { desde: number; hasta: number }>();
  for (const comp of comps) {
    if (!comp.firstDate || !comp.lastDate) continue;
    ventanaDelTorneo.set(comp.id, { desde: dayForDate(comp.firstDate), hasta: dayForDate(comp.lastDate) });
  }

  // Todos los partidos de todas las competiciones a acomodar, en orden de fecha. Van juntos y no
  // competición por competición porque el mapa de días ocupados es común: armarlo de nuevo para
  // cada una recorría los ~20.000 fixtures de la temporada nueve veces, y el armado del calendario
  // subía de 676 a 819 ms.
  const todos = comps.flatMap(comp => comp.matches.map(match => ({ comp, match })));
  todos.sort((a, b) => a.match.date.localeCompare(b.match.date));

  for (const { comp, match } of todos) {
    const original = dayForDate(match.date);
    let elegido: number | null = null;

    for (let salto = 0; salto <= MAX_CORRIMIENTO_DIAS && elegido === null; salto++) {
      // Primero hacia adelante (aplazar), después hacia atrás (adelantar).
      for (const d of salto === 0 ? [original] : [original + salto, original - salto]) {
        const v = ventanaDelTorneo.get(comp.id);
        if (v && (d < v.desde || d > v.hasta)) continue;
        if (!libre(match.home, d) || !libre(match.away, d)) continue;
        if (!dentroDeSuTemporada(match.home, d) || !dentroDeSuTemporada(match.away, d)) continue;
        elegido = d;
        break;
      }
    }
    // Sin hueco en 45 días para ninguno de los dos: es el único caso en que un partido no entra, y
    // no ha pasado con los datos actuales. Se informa en vez de desaparecer en silencio.
    if (elegido === null) continue;

    const date = dateForDay(elegido);
    const suyo: DatedMatch = { ...match, date };
    agregar(match.home, { competition: comp, match: suyo, date, isHome: true, opponentName: match.away, temporada });
    agregar(match.away, { competition: comp, match: suyo, date, isHome: false, opponentName: match.home, temporada });
    bloquear(match.home, elegido);
    bloquear(match.away, elegido);
  }
}

function reservarFechasDeCopa(
  comp: DatedCompetition,
  temporada: number,
  indice: Map<string, DatedFixture[]>,
  agregar: (club: string, fx: DatedFixture) => void,
) {
  for (const club of clubesDelPais(comp)) {
    const propios = indice.get(club) ?? [];
    // Un club sin ningún partido esta temporada no está jugando: no hay dónde meterle la copa.
    if (!propios.length) continue;

    const deEstaCopa = propios.filter(f => f.competition.id === comp.id);
    // Si el fragmento real ya lo llevó hasta la FINAL, la copa terminó para este club: reservarle
    // fechas después la haría empezar de nuevo y coronar un segundo campeón del mismo torneo en el
    // mismo año. Pasa en la temporada 1 con la Copa del Rey y la Coppa Italia, que en el calendario
    // real llegan hasta la final.
    if (deEstaCopa.some(f => esRondaFinal(f.match.round))) continue;

    const fechasDeEstaCopa = deEstaCopa.map(f => f.date).sort();
    // CADA COPA PIDE LO SUYO. Antes había una bolsa única y cada torneo pedía "la bolsa entera menos
    // lo que ya reservó otro": el primero que preguntaba se la llevaba completa y el segundo se
    // quedaba en cero. Medido en el Junior: la Sudamericana pedía 22 de 22 y la Copa BetPlay
    // terminaba con faltan = -2, o sea que su cuadro no tenía UN SOLO día donde jugarse después de
    // la vuelta real. Por eso la copa desaparecía del calendario a mitad de torneo.
    //
    // El reparto por orden de llegada nunca tuvo sentido: no son dos torneos peleando por el mismo
    // día, son dos torneos que necesitan días distintos. Lo que cada uno necesita se sabe -- sale
    // del tamaño de su cuadro -- así que se pide eso y no un número global.
    const faltan = fechasQueNecesita(comp) - fechasDeEstaCopa.length;
    if (faltan <= 0) continue;

    // De acá para abajo se trabaja con NÚMEROS DE DÍA, no con strings de fecha. El bucle recorre
    // ventanas de varios meses día por día, y hacerlo con aritmética de Date multiplicaba por ocho
    // el tiempo de armar el calendario: medido, 253 ms -> 2124 ms en la primera pantalla.
    //
    // El índice todavía no está ordenado en este punto (se ordena una sola vez, después), así que
    // el primer y el último día se sacan a mano en la misma pasada que arma los vetados.
    const vetados = new Set<number>();
    const ocupadosDelClub = new Set<number>();
    let primerDia = Infinity;
    let ultimoDia = -Infinity;
    for (const f of propios) {
      const dia = dayForDate(f.date);
      ocupadosDelClub.add(dia);
      if (dia < primerDia) primerDia = dia;
      if (dia > ultimoDia) ultimoDia = dia;
      for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
    }

    // Se arranca DESPUÉS del último partido real de esta copa: primero lo que sorteó la vida, y
    // recién cuando se acaba, lo generado.
    const ultimaReal = fechasDeEstaCopa[fechasDeEstaCopa.length - 1];
    let desde = ultimaReal
      ? dayForDate(ultimaReal) + ESPACIADOS_DE_COPA_DIAS[0]
      : (comp.firstDate ? dayForDate(comp.firstDate) : primerDia);

    // Techo: el final de la temporada del club, pero sin salirse de la VENTANA del torneo. Una
    // Copa BetPlay que se juega de mayo a agosto no puede tener su final en noviembre sólo porque
    // el club siga jugando la liga. Las ventanas están en docs/VENTANAS_DE_COMPETICIONES.md.
    const finDelTorneo = comp.lastDate ? dayForDate(comp.lastDate) : Infinity;
    let techo = finDelTorneo;

    // La bolsa de días de copa es UNA SOLA para las dos copas del club: cuando llega el día, el
    // juego pregunta primero por la continental y después por la nacional. Entonces la ventana de
    // la bolsa tiene que ser la UNIÓN de las dos, no sólo la de la copa nacional.
    //
    // Antes era sólo la nacional y por eso la Libertadores se quedaba sin dónde jugarse: la Copa
    // BetPlay va de mayo a agosto, así que al Junior le quedaban 3 días libres después de la fase
    // de grupos para un cuadro que necesita 8. Y a Peñarol, cuya Copa Uruguay arranca en
    // septiembre, no le quedaba NINGUNO para una fase de grupos que empieza en febrero.
    const ventana = ventanaContinentalPorClub().get(club);
    if (ventana) {
      const inicioContinental = dayForDate(sumarAniosADia(ventana.desde, temporada - 1));
      const finContinental = dayForDate(sumarAniosADia(ventana.hasta, temporada - 1));
      // El piso baja hasta el arranque de la copa continental, pero nunca antes de que el club
      // empiece a jugar: si no, se le reservan fechas en una temporada que para él no arrancó.
      if (!ultimaReal) desde = Math.max(primerDia, Math.min(desde, inicioContinental));
      techo = Math.max(techo, finContinental);
    }

    // El `min` con `ultimoDia` es lo que protege a Europa: un club inglés termina su temporada en
    // mayo, así que su techo sigue siendo mayo y no se le inventan fechas en noviembre.
    const hasta = Math.max(Math.min(ultimoDia, techo), desde);

    // Las copas Conmebol tienen las fechas REALES de su knockout (ver fechasConmebol.ts, sacadas de
    // los calendarios completos de 2025 que estaban en el repo). Se usan esas y no dias repartidos
    // a ojo: octavos a mediados de agosto, cuartos a mediados de septiembre, semis a fines de
    // octubre y la final a fines de noviembre, que es cuando se juegan de verdad.
    //
    // Entran aunque el club tenga partido ese dia: la copa continental le gana al torneo domestico,
    // igual que una fecha FIFA, y no cuesta descanso porque no agrega un dia nuevo al calendario.
    const reales = FECHAS_KNOCKOUT_POR_COPA[comp.id];
    const diasElegidos: number[] = [];
    if (reales) {
      for (const mesDia of reales.dias) {
        const dia = dayForDate(sumarAniosADia(`${CAREER_START_YEAR}-${mesDia}`, temporada - 1));
        // Sin techo por `ultimoDia`: la final de la Libertadores es el 29 de noviembre y el Junior
        // cerraba su calendario el 8, así que su propia final le quedaba fuera de rango. Un club que
        // llega a la final juega en noviembre aunque su liga ya haya terminado -- eso es lo normal.
        if (dia < primerDia) continue;
        // ENTRAN SIEMPRE. Antes se descartaba la fecha real si caía pegada a otro partido, y así se
        // perdían casi todas: al Junior le entraban 2 de 7, al Flamengo 2, al Santos 3. La final de
        // la Libertadores del 29 de noviembre no se jugaba nunca en su día.
        //
        // El veto de descanso no aplica acá porque no hay nada que negociar: la Conmebol fija sus
        // fechas y el torneo doméstico se acomoda alrededor: es al revés de como estaba. Un club que
        // juega los octavos el 13 de agosto y tiene liga el 15 juega los dos, como en la vida real.
        diasElegidos.push(dia);
        for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
      }
    }
    // Lo que falte se completa como siempre, repartido dentro de la ventana.
    diasElegidos.push(...elegirDias(desde, hasta, vetados, Math.max(0, faltan - diasElegidos.length), ocupadosDelClub));

    for (const dia of diasElegidos) {
      const date = dateForDay(dia);
      const match: DatedMatch = { date, home: club, away: RIVAL_POR_SORTEAR };
      agregar(club, {
        competition: comp, match, date, isHome: true,
        opponentName: RIVAL_POR_SORTEAR, temporada, esReservaDeCuadro: true,
      });
    }
  }
}

/**
 * `cuantas` fechas entre `desde` y `hasta`, lo más espaciadas que se pueda. NUNCA menos.
 *
 * Se prueba primero con la separación cómoda y se va apretando. Si ni la más apretada entra, se
 * COLOCAN IGUAL en los días libres que queden, aceptando menos descanso del ideal.
 *
 * POR QUÉ NO PUEDE DEVOLVER DE MENOS. Antes devolvía lo que entrara y seguía de largo; el
 * comentario decía "no rompe nada, la copa simplemente no llega a la final ese año". Sí rompe: es
 * un torneo entero desapareciendo del calendario a mitad de camino. Medido en el Junior, la Copa
 * BetPlay pedía 11 días, tenía 11 de cupo y recibía CERO -- el veto de descanso vetaba toda la
 * ventana, porque para agosto ya estaban tomados los días por la fase de grupos de la Libertadores
 * y por la liga. Reportado: "en el calendario la copa Colombia desaparece, le gané la ida y nunca
 * se jugó la vuelta".
 *
 * La distinción que faltaba: el descanso mínimo es una PREFERENCIA, no una pared. Un año tiene 365
 * días y un club juega 72 partidos -- nunca se está sin día, a lo sumo se está sin día cómodo.
 * Entre "jugar con dos días de descanso" y "que el torneo no exista", se juega. Lo único que sigue
 * siendo intocable es `ocupados`: dos partidos el mismo día no es incomodidad, es un partido que se
 * pierde, porque el paso del calendario elige uno solo (ver pickPrimary).
 *
 * SALTA en vez de recorrer día por día. Con 49 competiciones y 32 temporadas, caminar los ~300 días
 * de la ventana de cada copa para cada club llevó el armado del calendario a 703 ms, por encima del
 * tope de 600 que vigila el validador. Ahora se va directo al día ideal de cada slot y sólo se
 * avanza si está vetado: unas pocas comprobaciones en vez de trescientas. El relleno de abajo sí
 * recorre la ventana, pero corre SÓLO cuando el camino rápido se quedó corto, que es la excepción.
 */
function elegirDias(
  desde: number,
  hasta: number,
  vetados: Set<number>,
  cuantas: number,
  ocupados: ReadonlySet<number>,
): number[] {
  let mejor: number[] = [];
  for (const espaciado of ESPACIADOS_DE_COPA_DIAS) {
    const elegidos: number[] = [];
    let objetivo = desde;
    while (elegidos.length < cuantas && objetivo <= hasta) {
      let d = objetivo;
      while (d <= hasta && vetados.has(d)) d++;
      if (d > hasta) break;
      elegidos.push(d);
      objetivo = d + espaciado;
    }
    if (elegidos.length > mejor.length) mejor = elegidos;
    if (mejor.length >= cuantas) break;
  }
  if (mejor.length >= cuantas) return mejor;

  // Relleno: quedan días por colocar y el veto ya no alcanza para decidir, porque vetó todo. La
  // pregunta deja de ser "¿este día está libre?" y pasa a ser "¿cuál de los días que quedan molesta
  // menos?" -- se elige el que tenga menos partidos cerca. Repartir a ciegas metía las fechas
  // pegadas a las que ya había y multiplicaba por cinco los tramos de 4 partidos en 7 días.
  const elegidos = new Set(mejor);
  const libres: number[] = [];
  for (let d = desde; d <= hasta; d++) {
    if (elegidos.has(d) || ocupados.has(d)) continue;
    let vecinos = 0;
    for (let k = -VENTANA_DE_DESCANSO_DIAS; k <= VENTANA_DE_DESCANSO_DIAS; k++) {
      if (k && (ocupados.has(d + k) || elegidos.has(d + k))) vecinos++;
    }
    libres.push(d * 100 + vecinos);   // día y vecinos en un solo número: ordenar objetos acá cuesta
  }
  // Menos vecinos primero; a igualdad, el más temprano, para no amontonar el final del torneo.
  libres.sort((a, b) => (a % 100) - (b % 100) || a - b);
  for (let i = 0; i < libres.length && mejor.length < cuantas; i++) {
    const dia = Math.floor(libres[i] / 100);
    // Se re-chequea contra lo ya elegido en ESTA pasada: el conteo de vecinos se hizo antes de
    // empezar a colocar, y sin esto las mejores opciones terminan siendo días casi seguidos. Y se
    // exige el descanso entero, no sólo que no sean consecutivos: con el chequeo de ±1 al
    // Millonarios le salía un cuadrangular el 9, 11, 13, 16 y 19 de mayo -- un partido cada dos
    // días dentro de una ventana de cincuenta.
    let pegado = false;
    for (let k = -VENTANA_DE_DESCANSO_DIAS; k <= VENTANA_DE_DESCANSO_DIAS && !pegado; k++) {
      if (elegidos.has(dia + k)) pegado = true;
    }
    if (pegado) continue;
    elegidos.add(dia);
    mejor.push(dia);
  }
  return mejor.sort((a, b) => a - b);
}


const esCopaConCuadro = (comp: DatedCompetition) =>
  comp.kind === 'domestic_cup' && usaCuadroDelMotor(comp);

/**
 * En qué temporada de carrera está el club en este paso. 1 = la primera.
 *
 * Reemplaza a getSeasonYear, que lo calculaba como floor(paso / 52) + 1. Esa cuenta asume que toda
 * temporada dura 52 pasos y ninguna los dura: el Junior juega 65 fechas en 2026 y el Barcelona 34
 * en su media temporada inicial. Pasada la 52, getSeasonYear decía "temporada 2" mientras el
 * calendario seguía en 2026 -- y como de ese número cuelgan la clave de cada copa, el año de cada
 * título y qué edición jugás, la copa se reiniciaba a mitad de año con el jugador adentro.
 *
 * Agotado el calendario (más allá de MAX_TEMPORADAS) devuelve la última: a esa altura la carrera
 * terminó hace décadas y lo único que importa es que el número no siga creciendo solo.
 */
export function temporadaDeCarrera(clubName: string, paso: number): number {
  return temporadaDelPaso(clubName, paso)?.temporada ?? MAX_TEMPORADAS;
}

/** El AÑO calendario de ese paso (2026, 2027...), sacado de la fecha del partido. */
export function anioDeCarrera(clubName: string, paso: number): number {
  return anioDelPaso(clubName, paso) ?? CAREER_START_YEAR + temporadaDeCarrera(clubName, paso) - 1;
}

const cacheRotuloTemporada = new Map<string, string>();

/**
 * Cómo se LLAMA la temporada que está jugando el club: "2025/26" en Europa, "2026" en Sudamérica.
 *
 * No alcanza con el año calendario. La temporada del Barcelona va de agosto de 2025 a mayo de 2026,
 * así que mostrar el año a secas la partía al medio: hasta diciembre el juego decía 2025 y a partir
 * de enero decía 2026, siendo la MISMA temporada y el mismo campeonato. Reportado tal cual --
 * "hice una carrera con el Barcelona y me aparecían partidos en enero 2026 (...) eso hace que se
 * bugee un poco" -- y es exactamente cómo se ve desde adentro: el año cambia solo a mitad de camino.
 *
 * En Sudamérica no se nota porque la temporada es el año calendario, y por eso ahí sigue saliendo un
 * año solo: "Liga BetPlay 2026" es como se dice de verdad, "2026/26" no lo dice nadie.
 *
 * Se saca de las fechas de la LIGA del club, no de una lista de países: el dato ya está en el
 * calendario y así no hay que mantener a mano quién juega a caballo de dos años.
 */
export function rotuloDeTemporada(clubName: string, paso: number): string {
  const temporada = temporadaDeCarrera(clubName, paso);
  const clave = `${clubName}|${temporada}`;
  const cacheado = cacheRotuloTemporada.get(clave);
  if (cacheado !== undefined) return cacheado;

  const deLiga = fixturesForClub(clubName)
    .filter(f => f.temporada === temporada && f.competition.kind === 'league')
    .map(f => f.date)
    .sort();

  let rotulo: string;
  const primerAnio = Number(deLiga[0]?.slice(0, 4));
  const ultimoAnio = Number(deLiga[deLiga.length - 1]?.slice(0, 4));
  if (!deLiga.length || !primerAnio || primerAnio === ultimoAnio) {
    rotulo = String(primerAnio || anioDeCarrera(clubName, paso));
  } else {
    rotulo = `${primerAnio}/${String(ultimoAnio).slice(2)}`;
  }
  cacheRotuloTemporada.set(clave, rotulo);
  return rotulo;
}

/**
 * La fecha del paso, o la ÚLTIMA que el club tenga si el calendario ya se agotó.
 *
 * El agotamiento sólo pasa pasadas las 32 temporadas de MAX_TEMPORADAS, o sea después del final de
 * cualquier carrera. Existe igual porque la pantalla necesita SIEMPRE una fecha que mostrar, y el
 * respaldo que había antes era getRealDate -- el reloj de semanas -- que en ese punto ya llevaba
 * años de desfase contra el calendario. Devolver la última fecha real dice la verdad: ahí terminó.
 */
export function fechaDelPaso(clubName: string, paso: number): string | null {
  const s = fixturesAtStep(clubName, paso);
  if (s) return s.date;
  const todas = fixturesForClub(clubName);
  return todas.length ? todas[todas.length - 1].date : null;
}

/**
 * El rival de LIGA que tiene el club en ese paso, según el calendario.
 *
 * Reemplaza a getUpcomingMatchForLeague, que preguntaba "¿qué jornada toca esta semana?" y, si el
 * fixture no llegaba hasta ahí, GENERABA un round-robin sintético sobre la marcha. O sea: el último
 * lugar donde el motor viejo seguía inventando partidos, y encima para responder algo que el
 * calendario ya sabe. Se usa para los partidos que tu club juega sin vos (lesión, sanción,
 * descanso).
 */
export function rivalDeLigaEnPaso(clubName: string, paso: number): DatedFixture | null {
  const s = fixturesAtStep(clubName, paso);
  return s?.fixtures.find(f => f.competition.kind === 'league') ?? null;
}

// --- LOS PLAYOFFS DE LIGA (cuadrangulares) ------------------------------------------------------
//
// En Colombia y Argentina el semestre no termina con la tabla: los mejores juegan una eliminatoria
// aparte. En el Apertura 2026 se ve clarísimo en los datos -- 12 clubes juegan 19 fechas y se van a
// casa; ocho llegan a 21, cuatro a 23 y dos a 25. O sea cuartos, semis y final, todo a ida y vuelta.
//
// Esas fechas de más NO son fase regular y no pueden ir a la misma tabla. Sumándolas, el campeón
// salía de comparar 25 partidos contra 19: el que llegaba a la final quedaba arriba por haber
// jugado más, no por andar mejor.
//
// LA REGLA SALE DE LOS DATOS, no de una suposición sobre el formato: la cantidad MÁS COMÚN de
// fechas por club en ese semestre es la fase regular, y lo que un club juegue por encima de eso es
// playoff. Así funciona igual con 20 clubes que con 30, con zonas o sin ellas, y una liga sin
// playoffs (donde todos juegan lo mismo) no marca nada.

/** ¿Este partido de liga es de playoff y no de la fase regular? */
export function esPartidoDePlayoff(clubName: string, date: string): boolean {
  return fixturesForClub(clubName).some(f => f.date === date && f.esPlayoff === true);
}

// --- EL MERCADO DE PASES -------------------------------------------------------------------------
//
// Los meses en los que se puede fichar, como en la vida real: enero (la ventana de invierno) y de
// junio a agosto (la de verano, que en Sudamérica es la de mitad de año).
//
// Antes esto era "las semanas 1 a 7 y 19 a 22 de la temporada", con la temporada fijada en 52
// semanas. Como ninguna dura 52 -- el Junior juega 65 fechas y un club europeo 34 en su media
// temporada inicial -- la semana 19 caía en un mes distinto para cada club: el mercado se abría en
// marzo para uno y en agosto para otro, sin relación con ninguna ventana real.
const MESES_DE_MERCADO = new Set([1, 6, 7, 8]);

/** ¿Está abierto el mercado en la fecha de este paso? */
export function mercadoAbierto(clubName: string, paso: number): boolean {
  const fecha = fechaDelPaso(clubName, paso);
  return !!fecha && MESES_DE_MERCADO.has(Number(fecha.slice(5, 7)));
}

/**
 * Días hasta que vuelva a abrir el mercado. Sólo tiene sentido si está cerrado.
 *
 * Se cuenta en DÍAS y no en semanas porque el jugador avanza por fechas: decirle "faltan 3 semanas"
 * cuando su próximo mes de mercado empieza en 19 días es una cuenta que no se corresponde con nada.
 */
export function diasHastaElMercado(clubName: string, paso: number): number {
  const fecha = fechaDelPaso(clubName, paso);
  if (!fecha) return 0;
  const hoy = dayForDate(fecha);
  // Se busca hacia adelante el primer día de un mes de mercado. Un año alcanza siempre.
  for (let d = hoy + 1; d <= hoy + 366; d++) {
    if (MESES_DE_MERCADO.has(Number(dateForDay(d).slice(5, 7)))) return d - hoy;
  }
  return 0;
}

// --- LA VENTANA DEL MUNDIAL ---------------------------------------------------------------------
//
// El Mundial se juega en una ventana de FECHAS, como en la vida real: el de 2026 va del 11 de junio
// al 19 de julio, y los siguientes caen en el mismo tramo del año cada cuatro. Mientras dura, la
// liga doméstica y las copas de clubes están realmente paradas -- es la fecha FIFA más larga que
// existe.
//
// Antes era "un bloque de 9 semanas seguidas a partir de la semana 19 de la temporada". Con
// temporadas que duran entre 34 y 66 pasos según el club, la semana 19 caía en un mes distinto para
// cada uno: al Junior le tocaba en mayo y a un club europeo en diciembre. El Mundial ocurre en una
// fecha del calendario, no en un número de semana.

/** Primer y último día del Mundial, en el año que se juega. */
const MUNDIAL_DESDE = '06-11';
const MUNDIAL_HASTA = '07-19';

/**
 * Fechas que el Mundial ocupa. Son los pasos que necesita para resolverse entero: 3 de fase de
 * grupos, 5 de eliminación (32avos, octavos, cuartos, semis, final) y uno más donde el motor recién
 * detecta al campeón.
 */
const FECHAS_DE_MUNDIAL = 9;

/** La competición del Mundial dentro del calendario. No sale de los datos: la arma el motor. */
const COMPETICION_MUNDIAL: DatedCompetition = {
  id: 'mundial', name: 'Copa Mundial FIFA', kind: 'national_tournament',
  firstDate: null, lastDate: null, matches: [],
};

/**
 * Le reserva a CADA club las fechas del Mundial, y le saca las suyas de esa ventana.
 *
 * Las dos mitades hacen falta:
 *
 * - **Reservar** porque si no, el Mundial no se puede jugar. Un club europeo no tiene ni una fecha
 *   entre el 11 de junio y el 19 de julio -- su temporada terminó en mayo -- así que sin fechas
 *   propias el torneo no tendría dónde avanzar. Medido: Barcelona y Manchester City, 0 fechas en la
 *   ventana; Millonarios, 8.
 * - **Sacar las del club** porque durante el Mundial la liga está parada de verdad. Es la fecha
 *   FIFA más larga que hay, y en la vida real ningún torneo de clubes la pisa.
 *
 * Sólo corre en los años de Mundial. En los otros tres de cada cuatro, esta función no toca nada.
 */
function reservarFechasDeMundial(indice: Map<string, DatedFixture[]>, temporada: number) {
  const anio = CAREER_START_YEAR + temporada - 1;
  if (!esAnioDeMundial(anio)) return;

  const desde = dayForDate(`${anio}-${MUNDIAL_DESDE}`);
  const hasta = dayForDate(`${anio}-${MUNDIAL_HASTA}`);
  const paso = Math.floor((hasta - desde) / (FECHAS_DE_MUNDIAL - 1));

  for (const [club, propios] of indice) {
    if (!propios.length) continue;

    // Fuera lo del club que caiga en la ventana: el torneo doméstico está parado.
    const sobreviven = propios.filter(f => {
      const d = dayForDate(f.date);
      return d < desde || d > hasta;
    });

    // Los días pegados a un partido que SÍ sobrevive quedan vetados, igual que en las reservas de
    // copa. Sin esto, un club que jugaba el 10 de junio arrancaba el Mundial el 11: un día de
    // descanso entre el club y la selección.
    const vetados = new Set<number>();
    for (const f of sobreviven) {
      const d = dayForDate(f.date);
      for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(d + k);
    }

    const elegidos = elegirDias(desde, hasta, vetados, FECHAS_DE_MUNDIAL, new Set(sobreviven.map(f => dayForDate(f.date))));
    // Si el veto dejó menos de las que hace falta, se cae al reparto parejo: es preferible un
    // Mundial apretado contra el calendario del club a un Mundial que no llega a la final.
    const dias = elegidos.length >= FECHAS_DE_MUNDIAL
      ? elegidos
      : Array.from({ length: FECHAS_DE_MUNDIAL }, (_, i) => desde + i * paso);

    for (const dia of dias) {
      const date = dateForDay(dia);
      sobreviven.push({
        competition: COMPETICION_MUNDIAL,
        match: { date, home: club, away: RIVAL_POR_SORTEAR },
        date, isHome: true, opponentName: RIVAL_POR_SORTEAR,
        temporada, esReservaDeCuadro: true,
      });
    }
    indice.set(club, sobreviven);
  }
}

// --- FECHAS FIFA (eliminatorias) ---------------------------------------------------------------
//
// En los años SIN Mundial estos días estaban completamente vacíos: el calendario no le reservaba ni
// una fecha de selección a nadie entre 2027 y 2029, y por eso no había dónde jugar una eliminatoria.
//
// Las fechas son las REALES, sacadas de las eliminatorias pasadas que hay en el repo
// (data/calendarios/eliminatorias, de Transfermarkt) por scripts/generar_fechas_fifa.mjs. Sólo las
// fechas: el rival lo pone el cuadro del motor, igual que en las copas.
//
// Acá hubo primero cinco ventanas puestas a ojo -- marzo, junio, septiembre, octubre y noviembre,
// dos partidos en cada una -- y se acercaban, pero no eran las de verdad. Con los datos reales a la
// vista se ve por qué no alcanzaban: la eliminatoria de UEFA se juega ENTERA en el año previo al
// Mundial (26 fechas en uno solo) y la de Conmebol se reparte en los tres (11 + 15 + 10). Eso, con
// ventanas iguales para todos los años, no se puede representar.

/** La competición de las eliminatorias. No sale de los datos: la arma el motor, como el Mundial. */
const COMPETICION_ELIMINATORIAS: DatedCompetition = {
  id: 'eliminatorias', name: 'Eliminatorias Mundial', kind: 'national_tournament',
  firstDate: null, lastDate: null, matches: [],
};

/**
 * Le reserva a cada club los días de fecha FIFA del año, en las FECHAS REALES.
 *
 * A diferencia del Mundial, acá NO se le sacan al club sus partidos de esos días: son fechas
 * sueltas repartidas por todo el año y quitarle al club lo que caiga en cada una le rompería la
 * cuenta de la liga. Se toma la fecha real si ese día está libre, y si no, se saltea.
 *
 * Saltearla no cuesta el torneo: esa jornada de la eliminatoria se resuelve de fondo (ver
 * ponerAlDiaLaEliminatoria) y lo único que pasa es que el jugador se pierde ESE partido. Se probó
 * lo contrario -- meterla igual, ignorando el descanso -- y los hallazgos de "4 partidos en 7 días"
 * pasaron de 51 a 2356, porque la selección terminaba pegada al partido del club.
 *
 * Si al jugador no lo convocan, el día queda como descanso: exactamente lo que le pasa al que no
 * lo llaman.
 */
function reservarFechasFifa(indice: Map<string, DatedFixture[]>, temporada: number) {
  const anio = CAREER_START_YEAR + temporada - 1;
  const ciclo = cicloDeEliminatorias(anio);
  if (!ciclo) return;   // año de Mundial: la ventana grande es el Mundial

  // Las fechas reales que le tocan a ESTE año del ciclo. Las de UEFA caen casi todas en el año
  // previo al Mundial y las de Conmebol se reparten en los tres, así que el año importa.
  const aniosAntes = ciclo.mundial - anio;
  const delAnio = FECHAS_FIFA.filter(([a]) => a === aniosAntes).map(([, mesDia]) => `${anio}-${mesDia}`);
  if (!delAnio.length) return;

  for (const [club, propios] of indice) {
    if (!propios.length) continue;

    const vetados = new Set<number>();
    const ocupados = new Set<number>();
    for (const f of propios) {
      const d = dayForDate(f.date);
      ocupados.add(d);
      for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(d + k);
    }

    for (const date of delAnio) {
      const dia = dayForDate(date);
      // Un día que YA tiene partido del club sirve igual, y es lo que pasa de verdad: la fecha FIFA
      // le gana al partido del club (national_tournament es la prioridad más alta en pickPrimary),
      // el jugador se va con su selección y el club juega sin él. No cuesta descanso porque no
      // agrega un día nuevo al calendario -- es el MISMO día, con otro partido encima.
      //
      // Sin esto la cosa no cerraba: las fechas reales de Conmebol caen sobre los fines de semana
      // del fútbol colombiano, y al Junior le entraban 9 de las 18 de la eliminatoria.
      if (!ocupados.has(dia) && vetados.has(dia)) continue;
      {
        propios.push({
          competition: COMPETICION_ELIMINATORIAS,
          match: { date, home: club, away: RIVAL_POR_SORTEAR },
          date, isHome: true, opponentName: RIVAL_POR_SORTEAR,
          temporada, esReservaDeCuadro: true,
        });
        // La fecha tomada también veta, o dos fechas FIFA seguidas (las hay: 8 y 9 de septiembre)
        // caerían pegadas.
        for (let k = -(DESCANSO_MINIMO_DIAS - 1); k <= DESCANSO_MINIMO_DIAS - 1; k++) vetados.add(dia + k);
      }
    }
  }
}

/** Los Mundiales del juego: 2026, 2030, 2034... igual que los de verdad. */
export function esAnioDeMundial(anio: number): boolean {
  return (anio - CAREER_START_YEAR) % 4 === 0;
}

/**
 * El ciclo de eliminatorias al que pertenece un año: a qué Mundial clasifica y desde cuándo se juega.
 *
 * Las eliminatorias de 2030 son las de 2027, 2028 y 2029. Hace falta saberlo porque la tabla NO se
 * reinicia cada temporada: son 18 fechas repartidas en tres años, y la fecha 14 de Colombia cae en
 * 2029 aunque la 1 se haya jugado en 2027.
 */
export function cicloDeEliminatorias(anio: number): { mundial: number; desdeAnio: number } | null {
  if (esAnioDeMundial(anio)) return null;
  const desdeUltimoMundial = (anio - CAREER_START_YEAR) % 4;   // 1, 2 o 3
  return { mundial: anio + (4 - desdeUltimoMundial), desdeAnio: anio - desdeUltimoMundial + 1 };
}

/** ¿La fecha de este paso es una fecha FIFA de eliminatorias? */
export function esDiaDeEliminatorias(clubName: string, paso: number): boolean {
  const s = fixturesAtStep(clubName, paso);
  return !!s && s.fixtures.some(f => f.competition.id === COMPETICION_ELIMINATORIAS.id);
}

/**
 * Cuántas fechas de eliminatorias ya pasaron en ESTE CICLO para el club del jugador.
 *
 * Es el paso del torneo, igual que fechasDeCopaTranscurridas para las copas. Se cuenta desde el
 * arranque del ciclo y no desde el arranque de la temporada: si se reiniciara cada año, la tabla
 * volvería a cero en enero y las 18 fechas no se jugarían nunca.
 */
export function pasosDeEliminatoriasTranscurridos(clubName: string, paso: number): number {
  const hoy = fechaDelPaso(clubName, paso);
  if (!hoy) return 0;
  const ciclo = cicloDeEliminatorias(Number(hoy.slice(0, 4)));
  if (!ciclo) return 0;
  const desde = `${ciclo.desdeAnio}-01-01`;
  return fixturesForClub(clubName)
    .filter(f => f.competition.id === COMPETICION_ELIMINATORIAS.id && f.date >= desde && f.date < hoy)
    .length;
}

/** ¿La fecha de este paso cae dentro del Mundial? Ahí no hay liga ni copa de clubes. */
export function enVentanaDelMundial(clubName: string, paso: number): boolean {
  const fecha = fixturesAtStep(clubName, paso)?.date;
  if (!fecha) return false;
  if (!esAnioDeMundial(Number(fecha.slice(0, 4)))) return false;
  const diaDelAnio = fecha.slice(5);
  return diaDelAnio >= MUNDIAL_DESDE && diaDelAnio <= MUNDIAL_HASTA;
}

/**
 * Cuántas fechas del club ya cayeron dentro del Mundial de este año.
 *
 * Es el paso del torneo, igual que fechasDeCopaTranscurridas lo es para las copas de clubes: el
 * Mundial avanza al ritmo de los días que el jugador va jugando, no de un contador aparte.
 */
export function pasosDeMundialTranscurridos(clubName: string, paso: number): number {
  const t = temporadaDelPaso(clubName, paso);
  if (!t) return 0;
  let n = 0;
  for (let p = t.primerPaso; p < paso; p++) {
    if (enVentanaDelMundial(clubName, p)) n++;
  }
  return n;
}

/**
 * ¿Hoy le toca COPA a este club?
 *
 * Es la pregunta que antes contestaba isCupWeek con aritmética -- "2 de cada 5 semanas son de
 * copa" -- sin mirar el calendario de nadie. Con eso la pantalla podía anunciar un rival de copa y
 * al apretar el botón salir a jugar la liga, porque las dos cosas se decidían por caminos
 * distintos. Ahora hay una sola fuente: lo que el calendario puso ese día.
 */
export function esDiaDeCopa(clubName: string, paso: number): boolean {
  const s = fixturesAtStep(clubName, paso);
  if (!s) return false;
  const p = pickPrimary(s.fixtures);
  return !!p && (p.competition.kind === 'continental_cup' || p.competition.kind === 'domestic_cup');
}

/**
 * Cuántas fechas de COPA del club ya pasaron, contando hasta (sin incluir) el paso actual.
 *
 * Es el reemplazo directo de cupWeeksElapsedInYear/cupWeeksElapsedTotal, y con él las copas pasan a
 * correr POR RONDA en vez de por semanas: cada fecha de copa del calendario es exactamente un paso
 * del cuadro. Antes las dos cosas iban por relojes distintos -- el jugador avanzaba por fechas y la
 * copa por un reparto aritmético de semanas -- y de ahí salía que el motor le jugara la fase de
 * grupos de fondo: en el paso 18 del Junior, el conteo de semanas ya iba por el paso 10 de copa.
 *
 * `porTemporada` para las copas que empiezan y terminan dentro del año (Libertadores, Sudamericana)
 * y el total corrido para las que arrastran estado entre temporadas (Champions, Europa).
 */
export function fechasDeCopaTranscurridas(
  clubName: string, paso: number, porTemporada: boolean,
): number {
  const t = temporadaDelPaso(clubName, paso);
  if (!t) return 0;
  const desdePaso = porTemporada ? t.primerPaso : 1;

  let n = 0;
  for (let p = desdePaso; p < paso; p++) {
    const s = fixturesAtStep(clubName, p);
    if (!s) break;
    if (s.fixtures.some(f => f.competition.kind === 'continental_cup' || f.competition.kind === 'domestic_cup')) n++;
  }
  return n;
}

/**
 * Cuántas fechas de copa nacional le quedan al club en esta temporada, contando desde `desdeFecha`.
 *
 * Es el presupuesto real del torneo, y sirve para no armar un cuadro que no entra. La temporada 1
 * arranca el 12 de enero, o sea a mitad de la temporada europea: al Manchester City le quedan 4
 * fechas de FA Cup, y un cuadro de 8 clubes necesita 6 (tres rondas de ida y vuelta). Con esas dos
 * de menos el torneo no llegaba a la final y moría en semis sin campeón. Sabiendo el presupuesto,
 * se arma un cuadro de 4 y se corona igual.
 */
export function fechasDeCopaNacionalRestantes(clubName: string, temporada: number, desdeFecha: string): number {
  const fechas = new Set<string>();
  for (const f of getIndice(temporada).get(clubName) ?? []) {
    if (esCopaConCuadro(f.competition) && f.date >= desdeFecha) fechas.add(f.date);
  }
  return fechas.size;
}

/** Las fechas distintas de una lista de partidos: dos partidos el mismo día son UN paso. */
function fechasDistintas(fixtures: DatedFixture[]): string[] {
  const fechas: string[] = [];
  for (const f of fixtures) if (fechas[fechas.length - 1] !== f.date) fechas.push(f.date);
  return fechas;
}

/** ¿Este club tiene calendario con fechas reales? */
export function hasDatedSchedule(clubName: string): boolean {
  return (getIndice().get(clubName)?.length ?? 0) > 0;
}

/**
 * Versión BARATA de hasDatedLeagueSchedule, para preguntarlo de a miles.
 *
 * hasDatedLeagueSchedule pasa por fixturesForClub, que concatena las 32 temporadas del club y las
 * cachea: preguntarlo por los 1103 clubes de la base -- que es lo que hace el filtro de clubes
 * jugables -- construye 1103 listas completas que después nadie usa. Acá alcanza con mirar la
 * temporada 1, porque las siguientes son permutaciones del MISMO conjunto de clubes: si un club
 * juega liga con fechas alguna temporada, juega la 1.
 */
export function tieneLigaConFechasReales(clubName: string): boolean {
  const suyos = getIndice(1).get(clubName);
  return !!suyos && suyos.some(f => f.competition.kind === 'league');
}

/**
 * ¿Este club tiene calendario real de LIGA (no solo copa)?
 *
 * Los clubes de Segunda como Barranquilla FC o Real Cartagena figuran con calendario propio por dos
 * fechas sueltas de Copa BetPlay -- hasDatedSchedule da true -- pero su LIGA entera la corre el
 * motor por semanas, sin fechas reales. Todo lo que decide "qué fecha/rival es AHORA" (el reloj de
 * la carrera, la tarjeta de próximo partido, el paso de la semana) tiene que usar esta función y no
 * hasDatedSchedule: con la genérica, fixturesAtStep(club, 1) devolvía el primer partido REAL que
 * tiene el club -- la Copa BetPlay de julio -- y la carrera "arrancaba" en julio en vez de enero.
 * Bug reportado: "por que inicia la carrera alli y no en enero?".
 */
export function hasDatedLeagueSchedule(clubName: string): boolean {
  return fixturesForClub(clubName).some(f => f.competition.kind === 'league');
}

/** Todos los partidos del club, en orden cronológico. */
export function fixturesForClub(clubName: string): DatedFixture[] {
  const cacheado = todasLasTemporadasPorClub.get(clubName);
  if (cacheado) return cacheado;

  // Se concatenan TODAS las temporadas, no solo la real. Antes esto devolvía únicamente la
  // temporada 1 y por eso, a partir de enero de 2027, la pantalla de Calendario se veía vacía
  // aunque el club sí tuviera partidos: fixturesAtStep ya recorría las temporadas generadas, pero
  // todo lo que lista fechas (el calendario, pasoDeFecha, esUltimaFechaDelTorneo) seguía mirando
  // solo la primera. Bug reportado: "después de la primera temporada el calendario se ve vacío".
  //
  // El orden queda cronológico solo, porque cada temporada va corrida un año respecto de la
  // anterior; es el mismo orden en el que fixturesAtStep numera los pasos, así que los índices de
  // las dos funciones siguen coincidiendo.
  const todas: DatedFixture[] = [];
  for (let temporada = 1; temporada <= horizonte; temporada++) {
    const deLaTemporada = getIndice(temporada).get(clubName);
    if (deLaTemporada) todas.push(...deLaTemporada);
    else if (temporada === 1) break; // sin calendario real: no hay nada que generar
  }
  todasLasTemporadasPorClub.set(clubName, todas);
  return todas;
}

// fixturesForClub se llama en cada render de varias pantallas; armar las 32 temporadas cada vez se
// nota en móvil.
const todasLasTemporadasPorClub = new Map<string, DatedFixture[]>();

/**
 * Hasta qué temporada está construido el calendario. CRECE SOLO, nunca se achica.
 *
 * Antes se construían las 32 de una en la primera llamada, y ninguna carrera necesita la 32 el día
 * que arranca: son 650.000 objetos de fixture, y el costo crecía con cada competición que se
 * agregaba -- de 253 ms cuando había 34 competiciones a 764 con 49.
 *
 * Ahora se arman unas pocas y el horizonte se estira cuando alguien pregunta por una temporada más
 * lejana (avanzar la carrera lo hace solo, paso a paso). Al estirarse se tiran las listas por club,
 * que quedaron cortas: es lo único que hay que recordar si se toca esto.
 */
const HORIZONTE_INICIAL = 4;
let horizonte = HORIZONTE_INICIAL;

function asegurarHorizonte(temporada: number) {
  if (temporada <= horizonte) return;
  horizonte = Math.min(temporada + 2, MAX_TEMPORADAS);
  todasLasTemporadasPorClub.clear();
}

/**
 * Los partidos de un club en un día concreto.
 *
 * Casi siempre es 0 o 1, pero se devuelve lista porque nada impide que un club tenga dos partidos
 * el mismo día en los datos, y descartar en silencio es peor que mostrarlos.
 */
export function fixturesOnDate(clubName: string, date: string): DatedFixture[] {
  return fixturesForClub(clubName).filter(f => f.date === date);
}

/** El próximo partido del club en o después de `date`. */
export function nextFixture(clubName: string, date: string): DatedFixture | null {
  return fixturesForClub(clubName).find(f => f.date >= date) ?? null;
}

/** Partidos del club dentro de un rango de fechas, inclusive. */
export function fixturesBetween(clubName: string, desde: string, hasta: string): DatedFixture[] {
  return fixturesForClub(clubName).filter(f => f.date >= desde && f.date <= hasta);
}

/**
 * Cuántos días hay que avanzar desde `date` para llegar al próximo partido del club.
 *
 * Es lo que reemplaza al "avanzar una semana": en vez de saltar 7 días fijos, se salta hasta el
 * siguiente partido real. Devuelve null si el club ya no tiene más partidos.
 */
export function daysUntilNextFixture(clubName: string, date: string): number | null {
  const prox = nextFixture(clubName, date);
  if (!prox) return null;
  return dayForDate(prox.date) - dayForDate(date);
}

/**
 * El paso de carrera en el que cae una fecha de este club, o null si no juega ese día.
 *
 * Sirve para saber si un partido del calendario ya se jugó: su paso es menor al actual.
 */
export function pasoDeFecha(clubName: string, date: string): number | null {
  // Mismo filtro que fixturesAtStep: si una cuenta desde el arranque de la carrera y la otra desde
  // el principio del calendario, los pasos no coinciden y el calendario en pantalla marca como
  // "ya jugado" un partido que todavía no llegó (o al revés).
  const fechas: string[] = [];
  for (const f of fixturesForClub(clubName)) {
    if (f.date < inicioDeCarrera(clubName)) continue;
    if (fechas[fechas.length - 1] !== f.date) fechas.push(f.date);
  }
  const i = fechas.indexOf(date);
  return i < 0 ? null : i + 1;
}

/**
 * Cuántas fechas de LIGA (no copa) del calendario real ya se jugaron antes de `currentWeek`.
 *
 * El motor sintético de Apertura/Clausura (getOrCreateApeturaClausuraSeason) cuenta su catch-up en
 * "pasos" = casi una semana de carrera cada uno (apeturaClausuraStepsElapsed), sin distinguir liga
 * de copa -- currentWeek=32 contaba 31 pasos de liga sintética transcurridos. Pero el calendario
 * REAL intercala fechas de copa entre las de liga (Libertadores, Copa Colombia): de esos 32 pasos
 * reales del club, solo 24 eran de liga. El motor sintético avanzaba 7 pasos de MÁS -- de fondo,
 * sin el jugador -- y resolvía toda una ronda de knockout (ida y vuelta) antes de que el calendario
 * real llegara a esa fecha. El jugador veía en pantalla su partido real de Cuartos (con fecha y
 * rival de Transfermarkt) mientras el motor, por detrás, ya había resuelto Cuartos Y Semifinal
 * solo, y lo que el jugador terminaba jugando quedaba desincronizado del estado real de la llave.
 * Bug reportado: "me dio el campeonaao y habiamos empatado en el global, y el global nunca
 * aparecio" -- el global mostrado (si se mostraba) era el de una llave que ya no era la vigente.
 *
 * Se usa para topar el currentWeek que se le pasa al motor sintético: nunca debe avanzar el
 * catch-up de knockout más allá de las fechas de liga que el calendario real ya cubrió.
 */
export function fechasDeLigaTranscurridas(clubName: string, currentWeek: number): number {
  let n = 0;
  for (let w = 1; w < currentWeek; w++) {
    const paso = fixturesAtStep(clubName, w);
    if (paso && paso.fixtures.some(f => f.competition.kind === 'league')) n++;
  }
  return n;
}

/**
 * Cuántas fechas de liga tiene el torneo al que pertenece `date`, y de cuántas hay constancia de
 * haberse jugado. Sirve para no coronar campeón a quien no jugó el torneo.
 *
 * POR QUÉ EXISTE: un título de liga se anota cuando "cerró el torneo y quedaste primero", y ese
 * cierre se venía deduciendo del calendario. Cuando la deducción falla -- y falló, ver el comentario
 * de cerroElTorneo en App.tsx -- el título sale igual, con la tabla del motor, después de un puñado
 * de fechas. Reportado: "aun me dio el título de liga con Junior en tan solo unas fechas", en pleno
 * Apertura, allá por febrero.
 *
 * Contra eso no alcanza con arreglar la deducción: hay que hacer imposible el resultado absurdo.
 * Ganar el Apertura son 19 fechas; si el perfil tiene dos, no hay torneo que cerrar, venga de donde
 * venga la señal.
 *
 * `jugadas` sale de los días con resultado guardado, no de un contador: datedResults anota TODA
 * fecha jugada, incluidas las que el club resolvió sin el jugador (lesión, fatiga), que para esto
 * cuentan igual -- el torneo se jugó.
 */
export function fechasDeLigaDelTorneo(
  clubName: string,
  date: string,
  diasConResultado: ReadonlySet<string>,
): { jugadas: number; total: number } {
  const deLiga = fixturesForClub(clubName).filter(f => f.competition.kind === 'league');
  const esteFixture = deLiga.find(f => f.date === date);
  if (!esteFixture) return { jugadas: 0, total: 0 };

  // Mismo recorte que esUltimaFechaDelTorneo: temporada de carrera + torneo (Apertura/Clausura), o
  // el torneo entero donde el año trae uno solo. Sin el recorte por temporada, el total serían las
  // ~1200 fechas de las 32 temporadas generadas y ningún campeón pasaría el filtro nunca.
  const torneo = torneoDeFecha(esteFixture.competition, date);
  const mismos = deLiga.filter(f =>
    f.temporada === esteFixture.temporada && torneoDeFecha(f.competition, f.date) === torneo);

  // El día de hoy todavía no está en datedResults (se guarda después de resolver el partido), así
  // que se cuenta a mano: si no, el campeón legítimo de la última fecha quedaba uno corto.
  const jugadas = mismos.filter(f => f.date === date || diasConResultado.has(f.date)).length;
  return { jugadas, total: mismos.length };
}

/**
 * En Colombia y Argentina el año tiene DOS torneos de liga, no uno: el Apertura (enero a junio) y
 * el Clausura (julio a noviembre), cada uno con su campeón. Decir solo "Primera División" deja al
 * jugador sin saber cuál está jugando ni cuál puede ganar.
 *
 * El corte sale de las fechas reales: entre el último partido del Apertura (8 de junio) y el
 * primero del Clausura (24 de julio) hay un parón de 46 días.
 */
export function torneoDeFecha(competition: DatedCompetition, date: string): string {
  if (competition.kind !== 'league') return competition.name;
  // El corte por mes solo vale donde el año tiene DOS torneos. Las ligas europeas van de agosto a
  // mayo -- la temporada cruza el año -- así que partirlas por junio daba dos torneos donde hay
  // uno: LaLiga quedaba con un cierre falso el 21 de diciembre, coronando campeón a mitad de
  // temporada. Se detecta por la forma del calendario, no por una lista de ligas.
  if (!esCalendarioDeDosTorneos(competition)) return competition.name;
  const mes = Number(date.slice(5, 7));
  return mes <= 6 ? 'Apertura' : 'Clausura';
}

/**
 * Ligas que reparten DOS títulos por año (Apertura y Clausura).
 *
 * Va como lista explícita a propósito. Se intentó deducirlo de la forma del calendario y no se
 * puede: el Brasileirão va de enero a diciembre igual que la Liga BetPlay, y los dos tienen un
 * parón de mitad de año de 46 días exactos. Por forma son idénticos, pero Brasil corona UN campeón
 * y Colombia DOS. Deducirlo partía el Brasileirão en dos y coronaba dos campeones inventados.
 *
 * Es la misma lista que isApeturaClausuraLeague en leagueEngine, y tiene que seguir coincidiendo:
 * acá no se importa para no crear una dependencia circular entre los dos módulos.
 */
const LIGAS_DE_DOS_TORNEOS = new Set(['Colombiana', 'Argentina']);

function esCalendarioDeDosTorneos(competition: DatedCompetition): boolean {
  return LIGAS_DE_DOS_TORNEOS.has(competition.league);
}

/**
 * ¿Con este partido el club cierra su torneo de liga?
 *
 * En las ligas de Apertura/Clausura hay DOS cierres por año, no uno: el último partido de junio
 * corona el Apertura y el de noviembre el Clausura. Sin esto el campeón salía de `fixtures` del
 * motor, que tiene su propio calendario más corto (20 partidos contra los 44 reales del Nacional)
 * y nunca coincidía con el cierre real -- se terminaba el Apertura ganando todo y no se coronaba
 * a nadie.
 *
 * En las ligas de temporada corrida devuelve true solo en el último partido del año.
 */
export function esUltimaFechaDelTorneo(clubName: string, date: string): boolean {
  const deLiga = fixturesForClub(clubName).filter(f => f.competition.kind === 'league');
  if (!deLiga.length) return false;

  const esteFixture = deLiga.find(f => f.date === date);
  if (!esteFixture) return false;

  // Misma razón que en esUltimoPartidoDeLaCopa: hay que quedarse dentro de la temporada en curso,
  // o el "último partido del torneo" cae siempre en la última temporada generada.
  const torneo = torneoDeFecha(esteFixture.competition, date);
  const mismos = deLiga.filter(f =>
    f.temporada === esteFixture.temporada && torneoDeFecha(f.competition, f.date) === torneo);
  return mismos[mismos.length - 1]?.date === date;
}

/**
 * ¿Ya se jugó la última fecha real de LIGA de este club, y el paso actual quedó después de ella?
 *
 * Sirve para "Finalizar Temporada" (Dashboard.tsx). fixturesAtStep(club, currentWeek) da null tanto
 * si el calendario real se agotó como si todavía no arrancó (currentWeek=1) -- no alcanza por sí
 * solo. Y no sirve contar solo las fechas de kind='league' contra currentWeek: fixturesAtStep
 * numera los PASOS mezclando liga y copa (un club con 38 fechas de liga puede tener 40 pasos
 * totales con las 2 de copa intercaladas), así que comparar currentWeek contra "38" adelantaba el
 * cierre dos pasos antes de la fecha real. Se cuenta el paso exacto en el que cae la ÚLTIMA fecha
 * de liga -- ver pasoDeFecha -- y se compara currentWeek contra ESE paso, no contra la cantidad de
 * fechas de liga.
 *
 * No se usa getRealDate(currentWeek) como fecha de referencia a propósito: ese reloj cuenta
 * semanas sintéticas de 52 por año, sin relación con los pasos reales de un calendario que puede
 * tener más o menos de 52 -- comparar contra él daba falsos negativos.
 */
export function calendarioDeLigaAgotado(clubName: string, currentWeek: number): boolean {
  // Se mira SOLO la temporada en curso. Antes se tomaba la última fecha de liga de todo
  // fixturesForClub, que desde que concatena las 32 temporadas es una fecha de 2057: el paso actual
  // nunca la superaba y "Finalizar Temporada" no aparecía nunca más.
  const t = temporadaDelPaso(clubName, currentWeek);
  if (!t) return false;

  const deLiga = fixturesForClub(clubName).filter(f =>
    f.competition.kind === 'league' && f.temporada === t.temporada && f.date >= inicioDeCarrera(clubName));
  if (!deLiga.length) return false;

  const pasoDeLaUltima = pasoDeFecha(clubName, deLiga[deLiga.length - 1].date);
  if (pasoDeLaUltima === null) return false;
  return currentWeek > pasoDeLaUltima;
}

/** El torneo de liga que el club juega en esa fecha ('Apertura', 'Clausura' o el nombre de la liga). */
export function torneoDelClubEnFecha(clubName: string, date: string): string | null {
  const f = fixturesForClub(clubName).find(x => x.date === date && x.competition.kind === 'league');
  return f ? torneoDeFecha(f.competition, date) : null;
}

/**
 * El año calendario del paso actual, sacado de la FECHA del partido.
 *
 * getSeasonYear cuenta semanas de 52, pero con calendario real un paso es una FECHA CON PARTIDO, no
 * una semana: el Junior juega 54 pasos en todo 2026, así que a partir del paso 53 el contador de
 * semanas creía que ya era el año 2 y los últimos partidos del Clausura quedaban fechados en 2027
 * (el título salía como "Clausura 2027" jugándose el 8 de noviembre de 2026).
 *
 * Devuelve null si el club no tiene calendario real o si ya lo agotó: ahí manda getSeasonYear.
 */
export function anioDelPaso(clubName: string, step: number): number | null {
  const paso = fixturesAtStep(clubName, step);
  return paso ? Number(paso.date.slice(0, 4)) : null;
}

/** Un partido cuya ronda es la final del torneo. Las rondas vienen del calendario importado. */
function esRondaFinal(round: string | undefined): boolean {
  if (!round) return false;
  const r = round.toLowerCase();
  // "Final (Vuelta)" cuenta; "Semifinal" y "Cuartos de Final" NO -- de ahí el \b y el descarte
  // explícito de semi, que contiene la palabra "final" adentro.
  if (/semi|cuartos|octavos|dieciseisavos|ronda/.test(r)) return false;
  return /\bfinal\b/.test(r);
}

/**
 * ¿Este partido corona al campeón de esa copa?
 *
 * El motor no lleva las llaves de las copas del calendario real, así que no hay bracket que
 * consultar: hay que deducirlo del propio calendario. Se exige que el partido sea **la final**,
 * identificada por el nombre de la ronda que trae el calendario importado.
 *
 * ANTES alcanzaba con que fuera tu ÚLTIMO partido de la copa, y eso coronaba campeones falsos: la
 * Copa Libertadores del juego son 34 partidos de fase de grupos, sin una sola llave cargada, así
 * que el último partido del grupo pasaba por final y ganarlo te daba la copa. Igual la Copa BetPlay
 * y la Copa do Brasil. Solo las copas con rondas nombradas (Copa del Rey, FA Cup, DFB-Pokal,
 * Coppa Italia, EFL) pueden coronar, y solo en la ronda que se llama "Final".
 *
 * Con ida y vuelta marca solo la VUELTA, que es donde se define.
 */
export function esUltimoPartidoDeLaCopa(clubName: string, competitionId: string, date: string): boolean {
  const todosLosAnios = fixturesForClub(clubName).filter(f => f.competition.id === competitionId);
  // Acotar a la temporada de ESTA fecha: fixturesForClub concatena las 32 temporadas, así que sin
  // esto "el último partido de la copa" era el de 2057 y ninguna edición coronaba campeón.
  const temporadaDeHoy = todosLosAnios.find(f => f.date === date)?.temporada;
  if (temporadaDeHoy === undefined) return false;
  const delTorneo = todosLosAnios.filter(f => f.temporada === temporadaDeHoy);
  if (!delTorneo.length) return false;

  const finales = delTorneo.filter(f => esRondaFinal(f.match.round));
  if (finales.length) {
    // La ida de la final no corona: solo la última.
    return finales[finales.length - 1].date === date;
  }

  // Sin rondas nombradas hay que mirar la FORMA del torneo. Un torneo entero de dos clubes es una
  // final de ida y vuelta y nada más -- la Superliga de Colombia son exactamente 2 partidos entre
  // Junior y Santa Fe --, así que su último partido sí corona. Es distinto de la Libertadores, que
  // son 34 partidos entre 21 clubes de pura fase de grupos: ahí el último partido del grupo no
  // define nada y coronarlo daba campeones falsos.
  const clubes = new Set<string>();
  for (const f of todasLasFechas(competitionId)) { clubes.add(f.home); clubes.add(f.away); }
  if (clubes.size === 2) {
    return delTorneo[delTorneo.length - 1].date === date;
  }

  // Cualquier otro torneo sin rondas: no se puede saber dónde estuvo la final, no se corona a
  // nadie. Es preferible quedarse sin campeón a inventar uno por ganar un partido de grupos.
  return false;
}

/** Todos los partidos de una competición, sin filtrar por club. */
function todasLasFechas(competitionId: string): DatedMatch[] {
  return DATED_CALENDARS.find(c => c.id === competitionId)?.matches ?? [];
}

/**
 * Las fechas ANTERIORES de la misma llave: la ida de la final que se define en `date`.
 *
 * Hace falta para sumar el global -- una final de ida y vuelta se gana por la suma de los dos
 * partidos, no por el de vuelta. El criterio es el mismo rival en la misma competición, mirando
 * hacia atrás desde la vuelta.
 *
 * Devuelve solo fechas pasadas, nunca la propia `date`.
 *
 * NO alcanza con "el mismo rival en la misma temporada": en una FASE DE GRUPOS también se juega dos
 * veces contra cada rival, uno de local y otro de visitante, y esos dos partidos no forman una
 * llave -- valen tres puntos cada uno y no hay ningún global. Junior jugaba con Cerro Porteño el 14
 * de abril y otra vez el 8 de mayo, y la pantalla del partido anunciaba "Global 7-2" en plena fase
 * de grupos. Reportado: "en fase de grupos no hay global".
 *
 * Lo que sí distingue una llave de un grupo es que las dos piernas de una llave son CONSECUTIVAS:
 * entre la ida y la vuelta no se juega ningún otro partido de esa copa. En el grupo, en cambio,
 * entre los dos cruces con el mismo rival se juega contra los otros dos equipos (Junior metió a
 * Sporting Cristal el 29 de abril justo en el medio). Por eso se mira sólo el partido
 * INMEDIATAMENTE anterior de la copa, y cuenta únicamente si es contra este mismo rival.
 */
export function partidosDeLaMismaLlave(clubName: string, competitionId: string, date: string): string[] {
  const delTorneo = fixturesForClub(clubName).filter(f => f.competition.id === competitionId);
  const vuelta = delTorneo.find(f => f.date === date);
  if (!vuelta) return [];
  // Acotado a la MISMA temporada: fixturesForClub concatena las 32, y como la Superliga vuelve a
  // jugarse cada enero contra un rival que puede repetirse, sin este filtro la ida de 2026 entraba
  // en el global de la final de 2027 y el marcador global salía inflado.
  const previos = delTorneo.filter(f => f.temporada === vuelta.temporada && f.date < date);
  const anterior = previos[previos.length - 1];
  if (!anterior || anterior.opponentName !== vuelta.opponentName) return [];
  return [anterior.date];
}

/** Todas las competiciones en las que participa el club, sumando todas las temporadas. */
export function competitionsForClub(clubName: string): DatedCompetition[] {
  const vistas = new Map<string, DatedCompetition>();
  for (const f of fixturesForClub(clubName)) vistas.set(f.competition.id, f.competition);
  return [...vistas.values()];
}

/**
 * Las competiciones del club en UNA temporada concreta.
 *
 * Hace falta desde que las copas dejaron de salir del calendario a partir de la temporada 2: la
 * versión que suma todas las temporadas responde "sí, el calendario cubre esa copa" por lo que
 * había en la temporada 1, y con eso el motor no le arma el cuadro en la 2 -- el club se queda sin
 * copa. La pregunta correcta es siempre por el año en curso.
 */
export function competitionsForClubInSeason(clubName: string, temporada: number): DatedCompetition[] {
  const vistas = new Map<string, DatedCompetition>();
  for (const f of getIndice(temporada).get(clubName) ?? []) vistas.set(f.competition.id, f.competition);
  return [...vistas.values()];
}

// Prioridad cuando hay varios partidos el mismo día: una final continental pesa más que una fecha
// de liga.
const PRIORIDAD: Record<string, number> = {
  national_tournament: 4,
  continental_cup: 3,
  domestic_cup: 2,
  league: 1,
};

/** Si hay más de un partido el mismo día, cuál se le muestra al jugador. */
export function pickPrimary(fixtures: DatedFixture[]): DatedFixture | null {
  if (!fixtures.length) return null;
  return [...fixtures].sort(
    (a, b) => (PRIORIDAD[b.competition.kind] ?? 0) - (PRIORIDAD[a.competition.kind] ?? 0),
  )[0];
}

/**
 * Lo que le toca jugar al club en el paso N de su carrera.
 *
 * Solo cuentan las fechas DESDE el arranque de la carrera. Sin ese filtro, un club europeo empezaba
 * a jugar en el pasado: la temporada de LaLiga arranca en agosto de 2025 y la carrera el 12 de enero
 * de 2026, así que el paso 1 del Barcelona era Barcelona-Mallorca del 16 de agosto de 2025 y el
 * jugador se comía media temporada ya jugada antes de llegar a su primer partido "real".
 *
 * Un "paso" es una FECHA con partido, no una semana. Ésa es toda la diferencia con el motor viejo:
 * si el club juega liga el domingo y copa el jueves, son dos pasos distintos en vez de una sola
 * semana donde uno de los dos se perdía.
 *
 * Devuelve null cuando el club ya agotó su calendario real; el motor sigue avanzando por su cuenta.
 */
export function fixturesAtStep(clubName: string, step: number): { date: string; fixtures: DatedFixture[] } | null {
  if (step < 1) return null;
  // Los pasos se numeran de corrido a través de las temporadas: si la temporada 1 tiene 42 fechas,
  // el paso 43 es la primera fecha de la temporada 2. Así el reloj de la carrera nunca se queda sin
  // calendario y no hace falta un motor paralelo que tome el relevo.
  let restante = step;
  for (let temporada = 1; temporada <= MAX_TEMPORADAS; temporada++) {
    asegurarHorizonte(temporada);
    const todas = getIndice(temporada).get(clubName) ?? [];
    if (!todas.length) {
      // Un club sin fechas en la temporada 1 no tiene calendario real: no hay nada que recorrer.
      if (temporada === 1) return null;
      continue;
    }
    const fechas = fechasDistintas(todas);
    if (restante <= fechas.length) {
      const date = fechas[restante - 1];
      return { date, fixtures: todas.filter(f => f.date === date) };
    }
    restante -= fechas.length;
  }
  return null;
}

/** En qué temporada de carrera cae un paso, y cuál es el primer paso de esa temporada. */
export function temporadaDelPaso(clubName: string, step: number): { temporada: number; primerPaso: number } | null {
  if (step < 1) return null;
  let restante = step;
  let primerPaso = 1;
  for (let temporada = 1; temporada <= MAX_TEMPORADAS; temporada++) {
    asegurarHorizonte(temporada);
    const todas = getIndice(temporada).get(clubName) ?? [];
    if (!todas.length) {
      if (temporada === 1) return null;
      continue;
    }
    const fechas = fechasDistintas(todas);
    if (restante <= fechas.length) return { temporada, primerPaso };
    restante -= fechas.length;
    primerPaso += fechas.length;
  }
  return null;
}
