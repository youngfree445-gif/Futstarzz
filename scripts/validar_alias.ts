/**
 * UNA SOLA TABLA DE NOMBRES, Y QUE NINGÚN NOMBRE APUNTE A DOS CLUBES.
 *
 *   npm run validar:alias
 *
 * ---------------------------------------------------------------------------------------------
 * QUE PROTEGE
 * ---------------------------------------------------------------------------------------------
 *
 * Un club se llama distinto según quién lo escriba: el juego "Junior de Barranquilla", el calendario
 * "Junior FC", la base de jugadores "Junior". Eso vivía en cuatro tablas separadas -- dos dentro de
 * data.ts, una en clubAliases.ts y otra en el script de fichajes -- y cada arreglo entraba en una
 * sola.
 *
 * El costo se midió: el Bayern, el PSV, el Inter y el Lyon no recibieron NINGÚN fichaje de toda la
 * ventana de pases porque el nombre con el que Transfermarkt los escribe estaba cargado nada más en
 * la tabla del calendario, que el script de fichajes no leía.
 *
 * Ahora la tabla es una sola, src/clubAliases.ts, indexada por id de club. Este validador cuida las
 * cosas que la hacen confiable:
 *
 *   1. Cada entrada corresponde a un club que existe, y con el nombre que dice.
 *   2. Ningun nombre de busqueda lleva a dos clubes DEL MISMO PAIS. Entre paises se permite -- hay
 *      dos Everton y dos Nacional -- porque el pais los desempata; dentro de uno, no hay desempate
 *      posible y elegir seria inventar.
 *   3. Los scripts de datos leen la misma tabla que el juego, y la leen entera. Se comprueba
 *      parseandola como lo hace scripts/lib/data_ts.mjs y comparando contra el modulo.
 *   4. Los clubes que no recibian fichajes por culpa del nombre ahora se encuentran.
 *   5. Cada homonimo apunta a SU plantel, y ningun plantel de la base lo reclaman dos clubes: si dos
 *      lo comparten, uno esta alineando a los jugadores del otro y la pantalla se ve llena igual.
 *   6. En la lista de clubes hay SOLO clubes. El JSON trae las selecciones y los combinados de gala
 *      ("Premier League XI") como si fueran equipos, y se colaban entre los rivales posibles.
 */
import { readFileSync } from 'fs';
import { CLUBS_DATABASE, ULTIMATE_CLUBS_DATABASE, ALL_NATIONAL_TEAMS_DATABASE } from '../src/data';
import ALL_PLAYERS from '../src/playersDatabase.json';
import { NOMBRES_DE_CLUB, nombreDelPlantel, nombresDeBusqueda, nombreEnCalendario } from '../src/clubAliases';
import type { Club } from '../src/types';

let fallas = 0;
const ok = (nombre: string, cond: boolean, detalle = '') => {
  if (!cond) fallas++;
  console.log(`${cond ? 'OK  ' : 'FALLA'} ${nombre}${detalle ? '  ' + detalle : ''}`);
};

const clubes = CLUBS_DATABASE as Club[];
const porId = new Map(clubes.map(c => [c.id, c]));

// --- 1. Cada entrada es de un club que existe ---------------------------------------------------
console.log('\n=== la tabla habla de clubes que existen ===');
const sinClub = Object.keys(NOMBRES_DE_CLUB).filter(id => !porId.has(id));
ok('todos los ids de la tabla son clubes de data.ts', sinClub.length === 0, sinClub.join(', '));

const nombreCambiado = Object.entries(NOMBRES_DE_CLUB)
  .filter(([id, n]) => porId.has(id) && porId.get(id)!.name !== n.nombre)
  .map(([id, n]) => `${id}: tabla "${n.nombre}" vs data.ts "${porId.get(id)!.name}"`);
// Si alguien le cambia el nombre a un club en data.ts y no acá, la tabla empieza a mentir en
// silencio: el alias de calendario deja de encontrarlo y el club se queda sin fixture.
ok('el nombre visible de la tabla es el de data.ts', nombreCambiado.length === 0, nombreCambiado.slice(0, 5).join(' · '));

// --- 2. Ningún nombre lleva a dos clubes del mismo país -----------------------------------------
console.log('\n=== ningún nombre apunta a dos clubes del mismo país ===');
const duenos = new Map<string, { id: string; name: string; league: string }[]>();
for (const c of clubes) {
  // Con Set: un club puede llamarse igual en dos fuentes (el Atlético Nacional es "Atl. Nacional"
  // en el calendario y en la base) y eso no es un choque, es la misma respuesta dos veces.
  for (const nombre of new Set(nombresDeBusqueda(c.id).map(n => n.toLowerCase()))) {
    const k = nombre;
    if (!duenos.has(k)) duenos.set(k, []);
    duenos.get(k)!.push(c);
  }
}
const choques = [...duenos.entries()]
  .filter(([, cs]) => cs.length > 1)
  .map(([k, cs]) => {
    const paises = new Set(cs.map(c => c.league));
    return { k, cs, mismoPais: paises.size < cs.length };
  });
const choquesGraves = choques.filter(c => c.mismoPais);
ok('ningún alias lo comparten dos clubes de la misma liga', choquesGraves.length === 0,
   choquesGraves.map(c => `"${c.k}" -> ${c.cs.map(x => x.id).join(' + ')}`).join(' · '));
console.log(`     (${choques.length} nombres compartidos entre países, que el país desempata)`);

// --- 3. Los scripts leen la misma tabla, entera --------------------------------------------------
console.log('\n=== los scripts de datos leen la misma tabla ===');
// Se repite acá el parseo de scripts/lib/data_ts.mjs. Si alguien vuelve a escribir la tabla de una
// forma que ese lector no entiende, esto lo agarra: el lector viejo era una expresión regular que
// cortaba en la primera comilla simple y leía "Borussia M" en vez de "Borussia M'gladbach" -- el
// club se quedaba sin plantel y sin su ventana de pases, sin que nada avisara.
const texto = readFileSync('src/clubAliases.ts', 'utf8');
let leidaPorLosScripts: Record<string, any> = {};
let errorDeLectura = '';
try {
  const i = texto.indexOf('export const NOMBRES_DE_CLUB');
  const desde = texto.indexOf('{', i);
  const hasta = texto.indexOf('\n};', desde);
  const cuerpo = texto.slice(desde + 1, hasta)
    .split('\n').filter(l => !l.trim().startsWith('//')).join('\n')
    .replace(/,\s*$/, '');
  leidaPorLosScripts = JSON.parse('{' + cuerpo + '}');
} catch (e: any) {
  errorDeLectura = e.message;
}
ok('la tabla se parsea como JSON', errorDeLectura === '', errorDeLectura);
ok('los scripts leen las mismas entradas que el juego',
   Object.keys(leidaPorLosScripts).length === Object.keys(NOMBRES_DE_CLUB).length,
   `scripts: ${Object.keys(leidaPorLosScripts).length} · juego: ${Object.keys(NOMBRES_DE_CLUB).length}`);
const distintas = Object.keys(NOMBRES_DE_CLUB).filter(
  id => JSON.stringify(leidaPorLosScripts[id]) !== JSON.stringify(NOMBRES_DE_CLUB[id]));
ok('y las leen igual, campo por campo', distintas.length === 0, distintas.slice(0, 5).join(', '));

// LA PRUEBA QUE HABRÍA CAZADO EL BUG: los nombres con apóstrofo son justo los que el lector viejo
// partía por la mitad.
for (const [id, esperado] of [
  ['borussia_monchengladbach', "Borussia M'gladbach"],
  ['ohiggins', "CD O'Higgins"],
  ['newells', "Newell's"],
] as [string, string][]) {
  ok(`"${esperado}" se lee entero`, leidaPorLosScripts[id]?.plantel === esperado,
     String(leidaPorLosScripts[id]?.plantel));
}

// --- 4. Los clubes que perdían sus fichajes ahora se encuentran ----------------------------------
console.log('\n=== los clubes que no recibían fichajes ===');
// Cada uno de estos aparece en la ventana de pases de Transfermarkt con este nombre, y no le entraba
// un solo movimiento: el nombre no coincidía con nada y el fichaje se descartaba en silencio.
const COMO_LOS_ESCRIBE_TRANSFERMARKT: [string, string][] = [
  ['Bayern Munich', 'fc_bayern_munchen'],
  ['PSV Eindhoven', 'psv'],
  ['Olympique Lyon', 'olympique_lyonnais'],
  ['RCD Espanyol Barcelona', 'rcd_espanyol'],
  ['Inter Milan', 'inter'],
  ['Racing Club', 'racing'],
  ["CA Newell's Old Boys", 'newells'],
  ['Sporting Gijón', 'r_sporting'],
  ['Tigres UANL', 'tigres'],
  ['Atlas Guadalajara', 'atlas'],
  ['CS Independiente Rivadavia', 'indep_rivadavia'],
  ['Alianza Atlético Sullana', 'atlético_sullana'],
];
for (const [comoLoEscribeTM, id] of COMO_LOS_ESCRIBE_TRANSFERMARKT) {
  const encontrado = nombresDeBusqueda(id).some(n => n.toLowerCase() === comoLoEscribeTM.toLowerCase());
  ok(`"${comoLoEscribeTM}" lleva a ${id}`, encontrado);
}

// --- 5. Los homónimos siguen separados ----------------------------------------------------------
console.log('\n=== los homónimos, cada uno con su plantel ===');
// La razón de que la tabla vaya por id y no por nombre. Por nombre, los dos Everton recibían la
// misma plantilla y el de Viña del Mar alineaba a los de Goodison Park.
for (const [id, esperado] of [
  ['everton', 'Everton Chile'],
  ['everton_eng', 'Everton'],
  ['liverpool_uru', 'Liverpool F.C.'],
  ['liverpool_eng', 'Liverpool'],
  ['comunicaciones', 'Comunicaciones (A)'],
  ['comunicaciones_gt', 'Comunicaciones FC'],
  ['nacional_uru', 'Nacional U.'],
  ['nacional_paraguay', 'Club Nacional'],
] as [string, string][]) {
  const club = porId.get(id);
  ok(`${id} busca su plantel como "${esperado}"`, !!club && nombreDelPlantel(club) === esperado,
     club ? nombreDelPlantel(club) : 'no existe el club');
}

// --- 6. Ningún plantel lo comparten dos clubes ---------------------------------------------------
console.log('\n=== cada plantel es de un solo club ===');
// EL CHEQUEO QUE ENCONTRÓ LOS TRES QUE FALTABAN. Si dos clubes buscan su plantilla con el mismo
// nombre, uno de los dos está alineando a los jugadores del otro -- y no se nota: la pantalla se ve
// llena. Así estaban el Racing Club de Montevideo con los 31 de Avellaneda y el San Antonio de
// Ecuador con los 32 bolivianos de Bulo Bulo.
//
// Sólo cuenta si la base tiene jugadores con ese nombre: dos clubes sin plantel no se roban nada.
const cuantosEnLaBase = new Map<string, number>();
for (const p of ALL_PLAYERS as any[]) {
  if (!p.team_name) continue;
  const k = p.team_name.toLowerCase();
  cuantosEnLaBase.set(k, (cuantosEnLaBase.get(k) ?? 0) + 1);
}
const porPlantel = new Map<string, Club[]>();
for (const c of clubes) {
  const n = nombreDelPlantel(c).toLowerCase();
  if (!n) continue;   // null en la tabla: la base no lo tiene, a propósito
  if (!porPlantel.has(n)) porPlantel.set(n, []);
  porPlantel.get(n)!.push(c);
}
const compartidos = [...porPlantel.entries()]
  .filter(([n, cs]) => cs.length > 1 && (cuantosEnLaBase.get(n) ?? 0) > 0)
  .map(([n, cs]) => `"${n}" (${cuantosEnLaBase.get(n)} jugadores) <- ${cs.map(c => `${c.id} [${c.league}]`).join(' + ')}`);
ok('ningún plantel de la base lo reclaman dos clubes', compartidos.length === 0, compartidos.join(' · '));

// --- 7. Ninguna selección se hace pasar por club -------------------------------------------------
console.log('\n=== en la lista de clubes hay sólo clubes ===');
// El JSON de jugadores trae las selecciones y los combinados de gala ("Premier League XI") como si
// fueran equipos, y la lista de clubes los genera igual que a cualquier otro. Aparecían mezclados
// con clubes en los sorteos de rivales: se podía terminar jugando contra Uzbekistán.
//
// COMO SE RECONOCEN, sin depender de una lista de países: casi todos sus jugadores figuran ADEMÁS en
// otro equipo con el mismo player_id, porque su fila de verdad es la del club. Un club real no tiene
// a su plantel entero duplicado en otro lado.
const filas = new Map<string, number>();
const compartidas = new Map<string, number>();
const cuantasVeces = new Map<string, number>();
for (const p of ALL_PLAYERS as any[]) cuantasVeces.set(p.player_id, (cuantasVeces.get(p.player_id) ?? 0) + 1);
for (const p of ALL_PLAYERS as any[]) {
  if (!p.team_name) continue;
  filas.set(p.team_name, (filas.get(p.team_name) ?? 0) + 1);
  if ((cuantasVeces.get(p.player_id) ?? 1) > 1) compartidas.set(p.team_name, (compartidas.get(p.team_name) ?? 0) + 1);
}
const deVerdad = new Set(clubes.map(c => c.name.toLowerCase()));
const coladas = (ULTIMATE_CLUBS_DATABASE as Club[]).filter(c => {
  if (deVerdad.has(c.name.toLowerCase())) return false;   // cargado a mano: es un club
  const total = filas.get(c.name) ?? 0;
  return total >= 15 && (compartidas.get(c.name) ?? 0) / total > 0.8;
});
ok('ninguna selección ni combinado figura como club', coladas.length === 0,
   coladas.map(c => c.name).join(', '));

// Y que ES_SELECCION_NACIONAL siga cubriendo a las 93 selecciones del juego. Es la lista que no se
// puede derivar en data.ts -- se declara antes que ALL_NATIONAL_TEAMS_DATABASE -- así que el
// acuerdo entre las dos se exige acá. Sin esto la lista se quedó corta y 21 selecciones andaban
// sueltas por el juego haciéndose pasar por clubes.
const nombresDeSeleccion = new Set((ULTIMATE_CLUBS_DATABASE as Club[]).map(c => c.name.toLowerCase()));
const seleccionesComoClub = (ALL_NATIONAL_TEAMS_DATABASE as Club[])
  .map(s => s.name.replace(/^Selección de /, ''))
  .filter(pais => nombresDeSeleccion.has(pais.toLowerCase()));
ok('ninguna de las 93 selecciones del juego aparece en la lista de clubes',
   seleccionesComoClub.length === 0, seleccionesComoClub.join(', '));

// --- 8. El calendario sigue encontrando a los suyos ----------------------------------------------
console.log('\n=== el puente con el calendario sigue en pie ===');
const conCalendario = Object.values(NOMBRES_DE_CLUB).filter(c => c.calendario).length;
ok('la tabla conserva los alias de calendario', conCalendario > 100, `${conCalendario} clubes`);
ok('Junior de Barranquilla es "Junior FC" en el calendario',
   nombreEnCalendario('Junior de Barranquilla') === 'Junior FC', nombreEnCalendario('Junior de Barranquilla'));
ok('un club sin alias se devuelve igual', nombreEnCalendario('Palmeiras') === 'Sociedade Esportiva Palmeiras');

console.log(fallas === 0
  ? '\nUna sola tabla de nombres, y ningún nombre lleva a dos clubes del mismo país.'
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
