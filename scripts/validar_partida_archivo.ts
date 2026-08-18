// Validador de EXPORTAR/IMPORTAR partida. Se corre con `npm run validar:partida`.
//
// Una carrera puede durar 32 temporadas y vive sólo en el localStorage del navegador. El archivo es
// el único respaldo posible, así que lo que hay que probar no es que "haga algo", sino las dos cosas
// que arruinarían al jugador: que lo exportado vuelva IDÉNTICO, y que un archivo corrupto NO pise
// la ranura que ya tenía.

import { exportarPartida, guardarRanura, importarPartida } from '../src/partidaArchivo';

// --- Entorno mínimo de navegador -------------------------------------------------------------
const almacen = new Map<string, string>();
let ultimoBlob = '';
(globalThis as any).localStorage = {
  getItem: (k: string) => almacen.get(k) ?? null,
  setItem: (k: string, v: string) => { almacen.set(k, v); },
  removeItem: (k: string) => { almacen.delete(k); },
};
(globalThis as any).Blob = class { constructor(partes: string[]) { ultimoBlob = partes.join(''); } };
(globalThis as any).URL = { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} };
(globalThis as any).document = {
  createElement: () => ({ href: '', download: '', click() {} }),
  body: { appendChild() {}, removeChild() {} },
};
const comoArchivo = (texto: string) => ({ text: async () => texto }) as File;

// --- Una partida de ejemplo, con acentos y datos anidados --------------------------------------
const PERFIL = {
  name: 'Camilo Ñáñez', currentClubId: 'junior', currentWeek: 137,
  attributes: { ritmo: 82, regate: 79, tiro: 88, defensa: 41, pase: 74, fisico: 70 },
  seasonHistory: [{ year: 1 }, { year: 2 }, { year: 3 }],
  careerStats: { golesHistoricos: 91, partidosHistoricos: 210 },
  cupTitles: [{ competition: 'Copa Libertadores', year: 2028 }],
  datedResults: [{ date: '2028-11-29', myGoals: 2, rivalGoals: 1 }],
};
const TIENDA = [{ id: 'auto_lujo', purchased: true }, { id: 'mansion', purchased: false }];

almacen.set('futbol_star_save_slot_1', JSON.stringify(PERFIL));
almacen.set('futbol_star_shop_slot_1', JSON.stringify(TIENDA));

let fallas = 0;
const check = (nombre: string, ok: boolean, detalle = '') => {
  console.log(`   ${ok ? 'OK  ' : 'MAL '} ${nombre}${detalle ? '  ' + detalle : ''}`);
  if (!ok) fallas++;
};

console.log('=== A) Exportar ===');
const nombreArchivo = exportarPartida('slot_1', 'Junior de Barranquilla');
check('devuelve un nombre de archivo', !!nombreArchivo, String(nombreArchivo));
check('el nombre no lleva acentos ni espacios', !!nombreArchivo && /^[a-zA-Z0-9.-]+$/.test(nombreArchivo));
const exportado = JSON.parse(ultimoBlob);
check('lleva el rótulo del formato', exportado.formato === 'futstarzz-partida');
check('lleva el resumen legible', exportado.resumen?.club === 'Junior de Barranquilla' && exportado.resumen?.temporada === 3);
check('lleva la TIENDA además del perfil', Array.isArray(exportado.tienda) && exportado.tienda.length === 2);

console.log('\n=== B) Importar en OTRA ranura: ¿vuelve idéntico? ===');
const r = await importarPartida(comoArchivo(ultimoBlob), 'slot_5');
check('la importación dice ok', r.ok, r.error ?? '');
const perfilVuelto = JSON.parse(almacen.get('futbol_star_save_slot_5') ?? 'null');
const tiendaVuelta = JSON.parse(almacen.get('futbol_star_shop_slot_5') ?? 'null');
check('el perfil vuelve IDÉNTICO', JSON.stringify(perfilVuelto) === JSON.stringify(PERFIL));
check('la tienda vuelve IDÉNTICA', JSON.stringify(tiendaVuelta) === JSON.stringify(TIENDA));
check('los acentos del nombre sobreviven', perfilVuelto?.name === 'Camilo Ñáñez');
check('el historial anidado sobrevive', perfilVuelto?.cupTitles?.[0]?.competition === 'Copa Libertadores');

console.log('\n=== C) Un archivo malo NO pisa la ranura ===');
const antes = almacen.get('futbol_star_save_slot_1');
for (const [caso, texto] of [
  ['no es JSON', 'esto no es json {{{'],
  ['JSON pero no es una partida', '{"hola":"mundo"}'],
  ['tiene el rótulo pero el perfil está vacío', '{"formato":"futstarzz-partida","version":1,"perfil":{}}'],
  ['viene de una versión más nueva', '{"formato":"futstarzz-partida","version":99,"perfil":' + JSON.stringify(PERFIL) + '}'],
  ['le falta currentClubId', '{"formato":"futstarzz-partida","version":1,"perfil":{"name":"x","currentWeek":1,"attributes":{},"seasonHistory":[]}}'],
] as [string, string][]) {
  const res = await importarPartida(comoArchivo(texto), 'slot_1');
  const intacta = almacen.get('futbol_star_save_slot_1') === antes;
  check(`rechaza: ${caso}`, !res.ok && intacta, res.ok ? '<-- LA DEJÓ ENTRAR' : '');
}

console.log('\n=== D) Ranura vacía ===');
check('exportar una ranura vacía devuelve null', exportarPartida('slot_6', 'X') === null);

// =============================================================================================
// GUARDAR CUANDO NO ENTRA MAS
// =============================================================================================
//
// Una carrera de 32 temporadas pesa ~1 MB y localStorage topa en ~5 MB por dominio, repartidos
// entre todas las ranuras. Cuando se pasa, setItem TIRA. Lo que no puede pasar es que el juego se
// entere tarde: sin esto, el jugador seguia jugando temporadas sobre una partida que ya no se
// guardaba y las perdia todas al cerrar.

console.log('');
console.log('--- guardarRanura ---');

const almacenBueno = new Map<string, string>();
const okGuardar = guardarRanura('slot_9', PERFIL as never, [{ id: 'x' }] as never, {
  setItem: (k: string, v: string) => { almacenBueno.set(k, v); },
});
check('guardado normal: devuelve ok', okGuardar.ok && !okGuardar.lleno);
check('guardado normal: escribe las DOS claves', almacenBueno.size === 2,
  [...almacenBueno.keys()].join(', '));

// El navegador lleno: setItem tira QuotaExceededError.
const seLlena = { setItem: () => { const e: any = new Error('lleno'); e.name = 'QuotaExceededError'; throw e; } };
const lleno = guardarRanura('slot_9', PERFIL as never, [] as never, seLlena);
check('almacenamiento lleno: NO tira, devuelve el fallo', lleno.ok === false);
check('y lo reconoce como "lleno" para poder avisar bien', lleno.lleno === true);

// Falla la SEGUNDA clave: la ranura no puede quedar a medias.
const aMedias = new Map<string, string>();
let escrituras = 0;
const fallaLaSegunda = { setItem: (k: string, v: string) => {
  escrituras++;
  if (escrituras === 2) throw new Error('se corto');
  aMedias.set(k, v);
} };
const parcial = guardarRanura('slot_9', PERFIL as never, [] as never, fallaLaSegunda);
check('si falla la segunda clave, devuelve fallo', parcial.ok === false);
check('un error que NO es de espacio no se reporta como lleno', parcial.lleno === false);

console.log(`\n${fallas === 0 ? 'Sin fallas.' : `${fallas} fallas (ver arriba).`}`);
