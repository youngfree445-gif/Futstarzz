// EL RELATO CUENTA LO QUE PASO, y para eso tiene que saber de que jugas.
//
//   npm run validar:relato
//
// Dos bugs reportados el 5 de septiembre de 2026, y los dos son de la misma familia: el juego
// nombrando algo que no ocurrio.
//
//   A) "El arquero a veces trata de hacer gol". Las jugadas sueltas del relato estan escritas en
//      SEGUNDA PERSONA y vivian en una sola lista para los cuatro puestos, asi que al arquero le
//      contaban que se desmarcaba por la banda, que se escapaba solo contra el portero y -- lo mas
//      absurdo -- "¡Atajadon de nuestro portero!" siendo el el portero.
//
//   B) "La FA Cup dice partido de ida pero cuando acaba pasas de ronda, es un partido unico asi que
//      no deberia decir ida". El rotulo de la copa nacional pegaba "(Ida)" siempre, sin preguntar si
//      la llave tenia dos piernas -- dato que el cuadro ya trae.
//
// Los dos se comprueban igual: NO alcanza con que salga lo que tiene que salir, hay que comprobar
// que NO salga lo que no. Un relato que dice de mas se dibuja perfecto y miente igual.

import { faltasDelRelato, jugadasDelRelato } from '../src/jugadasDelRelato';
import { ULTIMATE_CLUBS_DATABASE as CLUBS } from '../src/data';
import { crearCopaNacional, cruceActual, rondaConPiernaDeCopaNacional } from '../src/copaNacional';
import { reglamentoDe } from '../src/reglamentos';
import type { Club, Position } from '../src/types';

let fallas = 0;
const ok = (n: string, c: boolean, d = '') => {
  if (c) console.log(`   OK   ${n}${d ? '  ' + d : ''}`);
  else { fallas++; console.log(`   FALLA ${n}${d ? '  ' + d : ''}`); }
};

const CONTEXTO = { companero: 'Luis Díaz', rival: 'Rodrigo De Paul', atacanteRival: 'Julián Álvarez' };
const PUESTOS: Position[] = ['Delantero', 'Mediocampista', 'Defensor', 'Arquero'];

console.log('=== A) EL ARQUERO NO SE ESCAPA SOLO CONTRA EL PORTERO ===');
console.log('');

// Lo que un arquero NO puede leer sobre si mismo. Cada patron salio de la lista vieja, que era una
// sola para todos: son las lineas exactas que el usuario vio.
const IMPOSIBLES_PARA_EL_ARQUERO: [RegExp, string][] = [
  [/te desmarcas por la banda/i, 'se desmarca por la banda'],
  [/escapado solo contra el portero/i, 'se escapa solo contra el portero'],
  [/atajad[oó]n de nuestro portero/i, 'le narra la atajada de OTRO portero siendo el el portero'],
  [/presionas la salida del central/i, 'presiona la salida del central'],
  [/tocas r[aá]pido y de primera/i, 'toca de primera para oxigenar el juego'],
  [/intentas centrar/i, 'intenta centrar'],
];

const delArquero = jugadasDelRelato('Arquero', CONTEXTO);
for (const [patron, que] of IMPOSIBLES_PARA_EL_ARQUERO) {
  const culpables = delArquero.filter(l => patron.test(l));
  ok(`el arquero nunca lee que ${que}`, culpables.length === 0, culpables[0] ?? '');
}

// Y LA OTRA MITAD: que tenga las suyas, y suficientes. Un arquero con cuatro lineas posibles las
// repite tres veces por tiempo y se nota igual que el bug.
ok('el arquero tiene jugadas propias de arquero',
  delArquero.some(l => /salg?[oa]s con los puños|achicas|barrera|contragolpe|mano a mano/i.test(l)));
ok('y suficientes para que no se repitan todo el partido', delArquero.length >= 8,
  `${delArquero.length} lineas`);

console.log('');
for (const puesto of PUESTOS) {
  const lineas = jugadasDelRelato(puesto, CONTEXTO);
  ok(`${puesto}: tiene relato propio`, lineas.length >= 8, `${lineas.length} lineas`);
  ok(`${puesto}: ninguna linea sale vacia ni con undefined`,
    lineas.every(l => l.length > 10 && !/undefined|null/.test(l)));
}

// Los tres puestos de campo COMPARTEN bolsa a proposito: un defensor sube a los corners y presiona
// salidas. Lo que no se comparte es la del arquero.
const deCampo = PUESTOS.filter(p => p !== 'Arquero').map(p => jugadasDelRelato(p, CONTEXTO));
ok('los tres puestos de campo comparten el mismo relato',
  deCampo.every(l => l.length === deCampo[0].length && l.every((x, i) => x === deCampo[0][i])));
ok('y el del arquero es distinto',
  delArquero.length !== deCampo[0].length
  || delArquero.some((x, i) => x !== deCampo[0][i]));

// Sin plantel rival conocido no se puede nombrar a nadie, y las lineas que lo nombran tienen que
// desaparecer en vez de decir "undefined".
for (const puesto of PUESTOS) {
  const sinRival = jugadasDelRelato(puesto, { companero: 'Luis Díaz', rival: null, atacanteRival: null });
  ok(`${puesto}: sin plantel rival cargado, ninguna linea nombra a nadie que no exista`,
    sinRival.every(l => !/undefined|null/.test(l)), sinRival.find(l => /undefined/.test(l)) ?? '');
}

console.log('');
console.log('   Las faltas de ambiente tambien:');
const faltasArquero = faltasDelRelato('Arquero');
ok('el arquero no frena contragolpes en la mitad de la cancha',
  !faltasArquero.some(l => /contragolpe peligroso|mediocampo/i.test(l)));
ok('pero comete las suyas', faltasArquero.length >= 3, `${faltasArquero.length}`);
ok('y el jugador de campo conserva las suyas',
  faltasDelRelato('Delantero').some(l => /contragolpe/i.test(l)));

console.log('');
console.log('=== B) LA PIERNA SOLO SE NOMBRA CUANDO LA LLAVE TIENE DOS ===');
console.log('');
console.log('   liga            copa                 piernas   rotulo de la ronda');

const clubesDe = (liga: string) => CLUBS.filter(c => (c as Club).league === liga) as Club[];
const division = (c: Club) => ((c.division === 2 ? 2 : 1) as 1 | 2);

let unicasProbadas = 0, doblesProbadas = 0;
for (const liga of ['Inglesa', 'Alemana', 'Italiana', 'Colombiana', 'Brasileña']) {
  const clubes = clubesDe(liga);
  if (clubes.length < 8) { console.log(`   ${liga}: sin clubes suficientes en la base`); continue; }
  const reglamento = reglamentoDe(liga);
  const cup = crearCopaNacional(liga, 1, CLUBS as Club[], division, clubes.slice(0, 16).map(c => c.id));
  const mio = clubes[0];
  const tie = cruceActual(cup, mio.id);
  const rotulo = rondaConPiernaDeCopaNacional(cup, mio.id);
  const piernas = reglamento.copaPiernas?.rondas ?? 2;
  console.log(`   ${liga.padEnd(14)}  ${(reglamento.copaNacional ?? '?').padEnd(18)}   ${String(piernas).padStart(7)}   ${rotulo ?? '(sin cruce)'}`);

  if (!tie || !rotulo) { ok(`${liga}: hay cruce para el club del jugador`, false); continue; }
  if (piernas === 1) {
    unicasProbadas++;
    ok(`${liga}: la llave esta marcada como partido unico`, !!tie.partidoUnico);
    ok(`${liga}: y el rotulo NO dice Ida ni Vuelta`, !/\((Ida|Vuelta)\)/.test(rotulo), rotulo);
  } else {
    doblesProbadas++;
    ok(`${liga}: la llave es a doble partido`, !tie.partidoUnico);
    ok(`${liga}: y el rotulo SI dice la pierna`, /\((Ida|Vuelta)\)/.test(rotulo), rotulo);
  }
}

// Sin los dos lados, el caso no prueba nada: una regla que devuelve siempre lo mismo pasaria igual.
ok('se probaron copas a partido unico', unicasProbadas >= 2, `${unicasProbadas}`);
ok('y copas a doble partido', doblesProbadas >= 1, `${doblesProbadas}`);

console.log('');
console.log(`${fallas === 0 ? 'El relato sabe de que jugas, y la copa solo nombra la pierna cuando hay dos.' : `${fallas} FALLAS`}`);
process.exit(fallas === 0 ? 0 : 1);
