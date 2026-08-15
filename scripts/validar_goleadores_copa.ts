// Casos de los goleadores de copa deducidos del cuadro (ver src/lideresDeCopa.ts).
//
// Lo que se prueba acá NO es que compile. Es que la tabla de una copa deje de ser un ranking de un
// solo nombre, que el mismo cuadro dé SIEMPRE los mismos goleadores, y que una carrera vieja --
// guardada antes de que esto existiera -- siga abriendo y muestre su copa en curso.
import {
  lineasDeCopa, partidosDeCopaConmebol, partidosDeCopaNacional, partidosDeCopaUefa,
} from '../src/lideresDeCopa';
import { anotarEnLideres, claveDeCompeticion, lideresDe } from '../src/lideresPorCompeticion';
import { Club, CupState, TwoLegBracket, TwoLegTie, UefaCupState } from '../src/types';
import { DomesticCupState } from '../src/copaNacional';
import { CLUBS_DATABASE, ULTIMATE_CLUBS_DATABASE } from '../src/data';
import { getOrCreateCupState } from '../src/leagueEngine';

let fallas = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

// --- Clubes de juguete: cuatro figuras cada uno, con un arquero y un nueve identificables.
const club = (id: string, name: string): Club => ({
  id, name, league: 'Test', dt: 'DT', reputation: 3, initialSalary: 1000, marketValue: 1,
  starPlayers: [`Arq${id} (GK)`, `Zaga${id} (CB)`, `Nueve${id} (ST)`, `Diez${id} (CAM)`],
  description: '', badgeColor: '', badgeLogoUrl: '', division: 1,
} as Club);

const CLUBES: Club[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(l => club(`c${l}`, `Club ${l}`));

const fixture = (mw: number, home: string, away: string, hg: number, ag: number) =>
  ({ matchweek: mw, homeTeamId: home, awayTeamId: away, played: true, homeGoals: hg, awayGoals: ag });

const llave = (a: string, b: string, extra: Partial<TwoLegTie> = {}): TwoLegTie => ({
  clubAId: a, clubBId: b,
  firstLegGoalsA: null, firstLegGoalsB: null, secondLegGoalsA: null, secondLegGoalsB: null,
  played: false, winnerId: null, ...extra,
});

// =============================================================================================
// 1. GRUPOS: la tabla deja de ser un ranking de uno
// =============================================================================================

const copaConmebol = (): CupState => ({
  cupId: 'libertadores', year: 1, stage: 'groups', championId: null, stepsConsumed: 6,
  knockout: null,
  groups: [
    {
      id: 'A', clubIds: ['cA', 'cB', 'cC', 'cD'], table: [],
      fixtures: [
        fixture(1, 'cA', 'cB', 2, 1), fixture(1, 'cC', 'cD', 0, 3),
        fixture(2, 'cA', 'cC', 1, 1), fixture(2, 'cB', 'cD', 2, 2),
        // Pendiente a propósito: no tiene que aportar ni un gol.
        { matchweek: 3, homeTeamId: 'cA', awayTeamId: 'cD', played: false, homeGoals: null, awayGoals: null },
      ],
    },
    {
      id: 'B', clubIds: ['cE', 'cF', 'cG', 'cH'], table: [],
      fixtures: [fixture(1, 'cE', 'cF', 4, 0), fixture(1, 'cG', 'cH', 1, 2)],
    },
  ],
} as unknown as CupState);

const partidosGrupos = partidosDeCopaConmebol(copaConmebol());
ok('sólo entran los partidos ya jugados', partidosGrupos.length === 6, `(${partidosGrupos.length} de 7)`);

const lineasGrupos = lineasDeCopa(partidosGrupos, CLUBES);
const tablaGrupos = lideresDe(anotarEnLideres(undefined, 'Copa|1', lineasGrupos), 'Copa|1');
const golesRepartidos = tablaGrupos.goleadores.reduce((n, g) => n + g.goles, 0);
const golesReales = partidosGrupos.reduce((n, p) => n + p.homeGoals + p.awayGoals, 0);
ok('se reparten exactamente los goles del marcador, ni uno más',
   golesRepartidos === golesReales, `(${golesRepartidos} de ${golesReales})`);
ok('la tabla tiene goleadores de varios clubes, no uno solo',
   new Set(tablaGrupos.goleadores.map(g => g.clubName)).size >= 5,
   `(${new Set(tablaGrupos.goleadores.map(g => g.clubName)).size} clubes)`);
ok('los goles caen en delanteros y volantes, no en el arquero',
   tablaGrupos.goleadores.every(g => !g.nombre.startsWith('Arq')));
// Portería menos vencida: `lideresDe` pide un mínimo de partidos (con el total ganaba siempre el
// que menos jugó), así que hace falta un grupo con varias fechas para que alguien califique.
const grupoLargo = partidosDeCopaConmebol({
  ...copaConmebol(),
  groups: [{
    id: 'A', clubIds: ['cA', 'cB', 'cC', 'cD'], table: [],
    fixtures: [
      fixture(1, 'cA', 'cB', 0, 0), fixture(2, 'cA', 'cC', 1, 0),
      fixture(3, 'cA', 'cD', 2, 0), fixture(4, 'cB', 'cC', 3, 3),
    ],
  }],
} as unknown as CupState);
const tablaLarga = lideresDe(anotarEnLideres(undefined, 'Copa|1', lineasDeCopa(grupoLargo, CLUBES)), 'Copa|1');
ok('hay portería menos vencida con partidos suficientes',
   tablaLarga.arqueros.length > 0 && tablaLarga.arqueros[0].nombre.startsWith('Arq'),
   `(${tablaLarga.arqueros[0]?.nombre ?? 'ninguno'})`);
ok('y la gana el arquero que menos recibió por partido, no el que menos jugó',
   tablaLarga.arqueros[0].nombre === 'ArqcA', `(${tablaLarga.arqueros[0]?.nombre})`);

// =============================================================================================
// 2. ESTABILIDAD: el mismo cuadro da siempre lo mismo
// =============================================================================================

const primera = JSON.stringify(lineasDeCopa(partidosDeCopaConmebol(copaConmebol()), CLUBES));
const segunda = JSON.stringify(lineasDeCopa(partidosDeCopaConmebol(copaConmebol()), CLUBES));
ok('el goleador NO cambia de nombre entre dos lecturas del mismo cuadro', primera === segunda);

// Y con un cuadro más largo tampoco: es el caso real, donde la pantalla se redibuja muchas veces.
const tercera = JSON.stringify(lineasDeCopa(partidosDeCopaConmebol(copaConmebol()), CLUBES));
ok('sigue igual a la tercera lectura', primera === tercera);

// =============================================================================================
// 3. TU CLUB QUEDA AFUERA (si no, contaría doble)
// =============================================================================================

const sinMiClub = lineasDeCopa(partidosGrupos, CLUBES, 'cA');
ok('excluyendo tu club, ninguna línea es de tu club',
   sinMiClub.every(l => l.clubName !== 'Club A'));
ok('y tampoco entra el rival DE ESE partido por ese partido',
   // cA jugó 2 de los 6: contra cB (2-1) y contra cC (1-1). Se van 5 goles de los 10.
   sinMiClub.reduce((n, l) => n + (l.goles ?? 0), 0) === golesReales - 5,
   `(${sinMiClub.reduce((n, l) => n + (l.goles ?? 0), 0)} de ${golesReales - 5})`);

// =============================================================================================
// 4. IDA Y VUELTA: la localía se invierte en la vuelta
// =============================================================================================

const bracket: TwoLegBracket = {
  tiesByRound: [[
    llave('cA', 'cB', { firstLegGoalsA: 1, firstLegGoalsB: 0, secondLegGoalsA: 0, secondLegGoalsB: 3, played: true, winnerId: 'cB' }),
  ]],
  championId: null,
};
const copaNacional: DomesticCupState = { league: 'Test', year: 1, bracket, championId: null, participants: ['cA', 'cB'] };
const piernas = partidosDeCopaNacional(copaNacional);
ok('una llave completa da DOS partidos, ida y vuelta', piernas.length === 2);
ok('en la vuelta el local es el club B', piernas[1].homeTeamId === 'cB' && piernas[1].awayTeamId === 'cA');
ok('y el marcador de la vuelta no se da vuelta', piernas[1].homeGoals === 3 && piernas[1].awayGoals === 0);

const lineasLlave = lineasDeCopa(piernas, CLUBES);
const arqueroA = lineasLlave.filter(l => l.nombre === 'ArqcA');
const recibidosPorA = arqueroA.reduce((n, l) => n + (l.golesRecibidos ?? 0), 0);
ok('el arquero de A recibe los 3 de la vuelta y 0 en la ida', recibidosPorA === 3, `(${recibidosPorA})`);
ok('y suma los dos partidos', arqueroA.reduce((n, l) => n + (l.partidosDeArquero ?? 0), 0) === 2);

// La final de Conmebol es a partido único: se resuelve entera en la ida y NO hay vuelta que contar.
const soloIda = partidosDeCopaNacional({
  ...copaNacional,
  bracket: { tiesByRound: [[llave('cA', 'cB', { firstLegGoalsA: 2, firstLegGoalsB: 1, played: true, winnerId: 'cA', partidoUnico: true })]], championId: 'cA' },
});
ok('una final a partido único cuenta UN partido, no dos', soloIda.length === 1);

// Una llave a medio jugar aporta la ida y nada más.
const mediaLlave = partidosDeCopaNacional({
  ...copaNacional,
  bracket: { tiesByRound: [[llave('cA', 'cB', { firstLegGoalsA: 1, firstLegGoalsB: 1 })]], championId: null },
});
ok('una llave con la vuelta pendiente aporta sólo la ida', mediaLlave.length === 1);

// =============================================================================================
// 5. UEFA: fase de liga, playoff y cuadro entran los tres
// =============================================================================================

const uefa: UefaCupState = {
  cupId: 'champions', year: 1, participants: [], stage: 'knockout', championId: null,
  stepsConsumed: 10, startedAtStep: 0, table: [],
  fixtures: [fixture(1, 'cA', 'cB', 1, 0), fixture(2, 'cC', 'cD', 2, 2)] as any,
  playoff: [llave('cE', 'cF', { firstLegGoalsA: 1, firstLegGoalsB: 1, secondLegGoalsA: 2, secondLegGoalsB: 0, played: true, winnerId: 'cE' })],
  knockout: { tiesByRound: [[llave('cG', 'cH', { firstLegGoalsA: 3, firstLegGoalsB: 0, secondLegGoalsA: 1, secondLegGoalsB: 1, played: true, winnerId: 'cG' })]], championId: null },
};
const partidosUefa = partidosDeCopaUefa(uefa);
ok('la Champions cuenta fase de liga + playoff + cuadro', partidosUefa.length === 2 + 2 + 2, `(${partidosUefa.length})`);
const totalUefa = lineasDeCopa(partidosUefa, CLUBES).reduce((n, l) => n + (l.goles ?? 0), 0);
ok('y reparte todos sus goles', totalUefa === partidosUefa.reduce((n, p) => n + p.homeGoals + p.awayGoals, 0));

// =============================================================================================
// 6. UNA CARRERA VIEJA TIENE QUE SEGUIR ABRIENDO
// =============================================================================================
//
// Esto no guarda nada nuevo en la partida: la tabla se deduce del cuadro, que ya estaba guardado.
// El caso que importa es el perfil viejo, sin `lideresPorCompeticion` -- ni la clave, ni el objeto.

const perfilViejo = { lideresPorCompeticion: undefined };
const clave = claveDeCompeticion('Copa Libertadores', 1);
const fusionado = anotarEnLideres(perfilViejo.lideresPorCompeticion, clave, lineasGrupos);
const tablaVieja = lideresDe(fusionado, clave);
ok('un perfil SIN tabla guardada muestra igual los goleadores de su copa en curso',
   tablaVieja.goleadores.length > 0, `(${tablaVieja.goleadores.length} goleadores)`);
ok('y no se le inventa nada al perfil: la deducción no lo modifica',
   perfilViejo.lideresPorCompeticion === undefined);

// Y el jugador, que sí se anota partido a partido, convive con lo deducido sin pisarse.
const conElJugador = anotarEnLideres(
  anotarEnLideres(undefined, clave, [{ nombre: 'Cani', clubName: 'Club A', goles: 12, esVos: true }]),
  clave, lineasDeCopa(partidosGrupos, CLUBES, 'cA'));
const tablaMixta = lideresDe(conElJugador, clave);
ok('tus goles reales conviven con los deducidos del resto del cuadro',
   tablaMixta.goleadores.some(g => g.esVos && g.goles === 12)
   && tablaMixta.goleadores.some(g => !g.esVos));
ok('y seguís siendo el goleador si metiste más que nadie',
   tablaMixta.goleadores[0].esVos === true, `(${tablaMixta.goleadores[0].nombre})`);

// =============================================================================================
// 7. UNA COPA SIN JUGAR NO INVENTA GOLEADORES
// =============================================================================================

const copaVacia = partidosDeCopaConmebol({
  ...copaConmebol(),
  groups: [{ id: 'A', clubIds: ['cA', 'cB'], table: [], fixtures: [{ matchweek: 1, homeTeamId: 'cA', awayTeamId: 'cB', played: false, homeGoals: null, awayGoals: null }] }],
} as unknown as CupState);
ok('una copa recién sorteada no tiene goleadores', copaVacia.length === 0);
ok('y la tabla queda vacía, no rota', lideresDe(anotarEnLideres(undefined, clave, lineasDeCopa(copaVacia, CLUBES)), clave).goleadores.length === 0);

// Un club que no está en la base no puede romper el reparto (pasa con clubes de ligas no cargadas).
ok('un club desconocido se saltea sin tirar el cálculo',
   lineasDeCopa([{ id: 'x', homeTeamId: 'fantasma', awayTeamId: 'cA', homeGoals: 2, awayGoals: 1 }], CLUBES).length === 0);

// =============================================================================================
// 8. CON LOS CLUBES DE VERDAD, NO CON LOS DE JUGUETE
// =============================================================================================
//
// Los casos de arriba usan planteles inventados con la posición bien puesta, así que no habrían
// detectado el problema que sí apareció al correr esto contra la base real: `ULTIMATE_CLUBS_DATABASE`
// le SACA la posición al plantel ('Rodrigo Rey (GK)' -> 'Rodrigo Rey'), y de esa etiqueta dependen
// las dos reglas del reparto. Con ULTIMATE, el arquero de Independiente terminó goleador de la
// Libertadores con 7 y la portería menos vencida quedó vacía: cero arqueros en 125 partidos.
//
// Por eso este bloque corre una Libertadores REAL de punta a punta.

const copaReal = getOrCreateCupState('libertadores', 1, ULTIMATE_CLUBS_DATABASE, undefined, 20);
const partidosReales = partidosDeCopaConmebol(copaReal);
ok('una Libertadores entera deja más de 100 partidos en el cuadro',
   partidosReales.length > 100, `(${partidosReales.length})`);

const tablaReal = lideresDe(
  anotarEnLideres(undefined, clave, lineasDeCopa(partidosReales, CLUBS_DATABASE)), clave);

const esArquero = (nombre: string, club: string) => {
  const c = CLUBS_DATABASE.find(x => x.name === club);
  return (c?.starPlayers ?? []).some(f => f.startsWith(nombre) && /\(GK\)/.test(f));
};
ok('el goleador de la copa NO es un arquero',
   !esArquero(tablaReal.goleadores[0].nombre, tablaReal.goleadores[0].clubName),
   `(${tablaReal.goleadores[0].nombre}, ${tablaReal.goleadores[0].clubName})`);
ok('y ninguno de los diez primeros lo es',
   tablaReal.goleadores.slice(0, 10).every(g => !esArquero(g.nombre, g.clubName)));
ok('la portería menos vencida tiene arqueros de verdad',
   tablaReal.arqueros.length > 0, `(${tablaReal.arqueros.length} arqueros)`);
ok('y el primero ES un arquero',
   tablaReal.arqueros.length > 0 && esArquero(tablaReal.arqueros[0].nombre, tablaReal.arqueros[0].clubName),
   `(${tablaReal.arqueros[0]?.nombre})`);
ok('los goles repartidos siguen coincidiendo con los marcadores reales',
   tablaReal.goleadores.reduce((n, g) => n + g.goles, 0)
   === partidosReales.reduce((n, p) => n + p.homeGoals + p.awayGoals, 0));
ok('y la tabla se llena con muchos clubes, no con uno',
   new Set(tablaReal.goleadores.map(g => g.clubName)).size >= 20,
   `(${new Set(tablaReal.goleadores.map(g => g.clubName)).size} clubes)`);

console.log(fallas === 0 ? '\nLos 32 casos pasan.' : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
