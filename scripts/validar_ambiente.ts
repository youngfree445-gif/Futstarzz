/**
 * EL AMBIENTE DEL PARTIDO.
 *
 *   npm run validar:ambiente
 *
 * ---------------------------------------------------------------------------------------------
 * QUE COMPRUEBA
 * ---------------------------------------------------------------------------------------------
 *
 * Un sonido que arranca solo y no para es de las peores cosas que le puede pasar a una pagina: si
 * el jugador cierra el partido y sigue escuchando un estadio, cierra el juego. Asi que lo que hay
 * que proteger no es que SUENE -- eso se oye -- sino que se APAGUE, y que los archivos existan.
 *
 * No se puede reproducir audio desde node, asi que lo que se comprueba es lo que si se puede:
 *
 *   1. Que las cinco pistas esten en public/sfx/ambiente/ y sean MP3 de verdad.
 *   2. Que la pantalla de partido las apague en los tres caminos: pitazo final, desmontaje y
 *      pestaña escondida.
 *   3. Que el barajado no repita la misma pista dos veces seguidas, que es lo que delata un bucle.
 *   4. Que el peso total no se escape: se bajan al empezar un partido, y en un telefono con datos
 *      eso se paga.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { pistaDeLaCancha, hinchadasDe } from '../src/ambienteDelPartido';
import { hayRelatoEnIngles, relatoNumero, suenaElMorse, RELATOS, CHANCE_DEL_MORSE } from '../src/relatoDelGol';

let fallas = 0;
const caso = (etiqueta: string, fn: () => void) => {
  try { fn(); console.log(`OK    ${etiqueta}`); }
  catch (e) { fallas++; console.log(`FALLA ${etiqueta} -- ${(e as Error).message}`); }
};

const FUENTE = readFileSync('src/ambienteDelPartido.ts', 'utf8');
const PANTALLA = readFileSync('src/components/MatchSimulator.tsx', 'utf8');

/** Las rutas que el modulo declara, leidas de su propia lista. */
const PISTAS = [...FUENTE.matchAll(/'(sfx\/ambiente\/[^']+)'/g)].map(m => m[1]);

caso('las pistas que el codigo pide existen de verdad', () => {
  if (PISTAS.length < 2) throw new Error(`el modulo declara ${PISTAS.length} pistas: con una sola no hay nada que intercalar`);
  for (const p of PISTAS) {
    const ruta = `public/${p}`;
    if (!existsSync(ruta)) throw new Error(`falta el archivo ${ruta}`);
    const d = readFileSync(ruta);
    // Un MP3 arranca con una cabecera de frame (0xFF 0xEx) o con una etiqueta ID3.
    const esId3 = d[0] === 0x49 && d[1] === 0x44 && d[2] === 0x33;
    const esFrame = d[0] === 0xFF && (d[1] & 0xE0) === 0xE0;
    if (!esId3 && !esFrame) throw new Error(`${p} no parece un MP3`);
  }
});

caso('el estadio se apaga por los tres caminos', () => {
  // 1. El pitazo final.
  if (!/playSfx\('whistle_end'\)[\s\S]{0,400}?pararAmbiente\(\)/.test(PANTALLA)) {
    throw new Error('el pitazo final no apaga el ambiente');
  }
  // 2. El desmontaje de la pantalla.
  if (!/return \(\) => pararAmbiente\(\)/.test(PANTALLA)) {
    throw new Error('salir de la pantalla no apaga el ambiente');
  }
  // 3. La pestaña escondida.
  if (!/visibilitychange/.test(PANTALLA) || !/document\.hidden\) pararAmbiente\(\)/.test(PANTALLA)) {
    throw new Error('el ambiente sigue sonando en una pestaña escondida');
  }
});

caso('el volumen del ambiente lo maneja el de los efectos', () => {
  // No tiene control propio a proposito: el jugador movio UNA perilla, no dos. Y el boton de
  // silencio tiene que apagar el estadio igual que apaga el gol.
  if (!/getSfxVolume\(\)/.test(FUENTE)) throw new Error('el ambiente no lee el volumen de los efectos');
  if (!/isSfxMuted\(\)/.test(FUENTE)) throw new Error('el boton de silencio no apagaria el estadio');
  // Y se relee en cada latido, no una sola vez al arrancar: mover la perilla a mitad de partido
  // tiene que oirse en el momento.
  if (!/function tick\(\)[\s\S]{0,200}?volumenObjetivo\(\)/.test(FUENTE)) {
    throw new Error('el volumen se lee una vez al arrancar: mover la perilla no haria nada');
  }
});

caso('la misma cancha suena SIEMPRE con la misma hinchada', () => {
  // Es lo que hace que la idea valga: si fuera al azar, tu propio estadio cambiaria de hinchada
  // cada fecha y no habria nada que reconocer.
  for (const club of ['junior_de_barranquilla', 'boca_juniors', 'arsenal', 'fc_barcelona']) {
    const a = pistaDeLaCancha(club);
    for (let i = 0; i < 50; i++) {
      if (pistaDeLaCancha(club) !== a) throw new Error(`${club} cambio de hinchada entre dos llamadas`);
    }
  }
});

caso('canchas distintas no suenan todas igual', () => {
  const clubes: [string, string][] = [
    ['junior_de_barranquilla','Colombiana'], ['boca_juniors','Argentina'], ['river_plate','Argentina'],
    ['santos','Brasileña'], ['atletico_nacional','Colombiana'], ['millonarios_fc','Colombiana'],
    ['arsenal','Inglesa'], ['fc_barcelona','Española'], ['real_madrid','Española'],
    ['liverpool_eng','Inglesa'], ['inter','Italiana'], ['ajax','Holandesa'],
  ];
  const usadas = new Set(clubes.map(([id, liga]) => pistaDeLaCancha(id, liga)));
  console.log(`      (${clubes.length} clubes reparten en ${usadas.size} hinchadas distintas)`);
  if (usadas.size < 4) throw new Error(`${clubes.length} clubes caen en solo ${usadas.size} pistas`);
});

// EL REPARTO POR REGION. Una murga en Old Trafford sonaba raro: cada liga sortea entre las de SU
// region mas las generales, que son multitudes sin acento y funcionan en cualquier lado.
caso('una cancha europea nunca suena a hinchada sudamericana, ni al reves', () => {
  for (let i = 0; i < 400; i++) {
    const euro = pistaDeLaCancha(`club_${i}`, 'Inglesa');
    if (euro.includes('latam')) throw new Error(`una cancha inglesa sono con ${euro}`);
    const latam = pistaDeLaCancha(`club_${i}`, 'Argentina');
    if (latam.includes('europa')) throw new Error(`una cancha argentina sono con ${latam}`);
  }
});

caso('cada region puede sonar con SU hinchada, no solo con las generales', () => {
  for (const [liga, marca] of [['Argentina','latam'], ['Inglesa','europa']] as [string,string][]) {
    const suyas = hinchadasDe(liga).filter(p => p.includes(marca));
    if (!suyas.length) throw new Error(`${liga} no tiene ninguna hinchada propia para sortear`);
    const salieron = new Set(Array.from({ length: 400 }, (_, i) => pistaDeLaCancha(`c${i}`, liga)));
    if (![...salieron].some(p => p.includes(marca))) {
      throw new Error(`${liga} tiene hinchadas propias pero nunca le tocan`);
    }
  }
});

caso('una liga que no esta en ninguna lista cae en las generales', () => {
  // "Resto del Mundo", Estados Unidos, una liga suelta: la respuesta honesta es que no tenemos una
  // grabacion de esa hinchada, no inventarle una region.
  for (const liga of ['Resto del Mundo', 'Estadounidense', 'Japonesa', '']) {
    for (let i = 0; i < 60; i++) {
      const p = pistaDeLaCancha(`club_${i}`, liga);
      if (!p.includes('general')) throw new Error(`${liga || '(vacia)'} sono con ${p}`);
    }
  }
});

caso('sin club, la hinchada es una generica y no revienta', () => {
  for (const v of [null, undefined, '']) {
    const p = pistaDeLaCancha(v as string | null | undefined, null);
    if (!PISTAS.includes(p)) throw new Error(`con ${String(v)} devuelve "${p}", que no es una pista`);
    if (!p.includes('general')) throw new Error(`sin club deberia sonar una generica y suena ${p}`);
  }
});

caso('la pista se repite en bucle hasta el final del partido', () => {
  // El cruce encadena la pista CONSIGO MISMA: sin esto, al terminar el audio el estadio se callaba
  // y el resto del partido iba en silencio.
  if (!/entrando = crear\(actual\.pista, 0\)/.test(FUENTE)) {
    throw new Error('el ambiente no se re-encadena: al terminar la pista el estadio se calla');
  }
  // Y no puede usar `loop`, que empalma en seco.
  if (/\.loop\s*=\s*true/.test(FUENTE)) throw new Error('usa loop nativo: la costura se escucha');
});
caso('el ambiente no se descarga al abrir el juego', () => {
  // Vive fuera de SFX_FILES a proposito: preloadSfx() recorre esa lista al arrancar, y meter ahi
  // cuatro megas de estadio le cobraria la espera a todo el mundo, juegue o no un partido.
  const audio = readFileSync('src/audio.ts', 'utf8');
  if (/ambiente/.test(audio)) throw new Error('el ambiente entro al motor de efectos: se bajaria al abrir el juego');
  if (!/arrancarAmbiente\(\)/.test(PANTALLA)) throw new Error('nadie arranca el ambiente');
});

caso('el peso de las pistas no se escapa', () => {
  const total = PISTAS.reduce((n, p) => n + statSync(`public/${p}`).size, 0);
  const mb = total / (1024 * 1024);
  console.log(`      (${PISTAS.length} pistas, ${mb.toFixed(1)} MB en total)`);
  // Se bajan al empezar un partido. Mas de esto en un telefono con datos ya es una espera que se
  // nota antes del primer minuto.
  if (mb > 6) throw new Error(`${mb.toFixed(1)} MB de ambiente: hay que recortar las pistas`);
});


// ==================================================================================================
// EL GRITO DEL GOL
// ==================================================================================================
//
// Los dos relatos grabados estan EN INGLES, asi que soltarlos en cualquier gol seria un relator
// ingles gritando en el Metropolitano. La regla no es "hay relato o no", es DONDE.

caso('el relator en ingles suena en Inglaterra y en Estados Unidos', () => {
  for (const liga of ['Inglesa', 'Estadounidense']) {
    if (!hayRelatoEnIngles(liga)) throw new Error(`no hay relato en ${liga}`);
  }
});

caso('y NO suena en el resto del mundo', () => {
  for (const liga of ['Colombiana', 'Argentina', 'Española', 'Italiana', 'Brasileña', 'Resto del Mundo', '']) {
    if (hayRelatoEnIngles(liga)) throw new Error(`un relator ingles grito un gol en la liga ${liga || '(vacia)'}`);
  }
  // Y sin liga -- una seleccion, un amistoso -- tampoco: no se puede saber donde se juega.
  if (hayRelatoEnIngles(null) || hayRelatoEnIngles(undefined)) throw new Error('grita sin saber donde se juega');
});

caso('los dos relatos se alternan, no se sortean', () => {
  // Con dos grabaciones y un sorteo, la mitad de las veces el segundo gol suena igual que el
  // primero. Alternando hacen falta cuatro goles para que alguno se repita.
  const seguidos = Array.from({ length: 8 }, (_, i) => relatoNumero(i));
  for (let i = 1; i < seguidos.length; i++) {
    if (seguidos[i] === seguidos[i - 1]) throw new Error(`el gol ${i + 1} suena igual que el anterior`);
  }
  if (new Set(seguidos).size !== RELATOS.length) throw new Error('no se usan los dos relatos');
});

caso('el morse suena alguna que otra vez, no siempre ni nunca', () => {
  let veces = 0;
  const N = 200000;
  for (let i = 0; i < N; i++) if (suenaElMorse(Math.random())) veces++;
  const cada = N / veces;
  console.log(`      (el morse sale 1 de cada ${cada.toFixed(1)} goles)`);
  // Ni un tic en todos los goles ni una rareza que nadie escucha nunca.
  if (cada < 3) throw new Error(`sale 1 de cada ${cada.toFixed(1)}: es un tic, no un guiño`);
  if (cada > 25) throw new Error(`sale 1 de cada ${cada.toFixed(1)}: no lo va a escuchar nadie`);
  if (suenaElMorse(0.999)) throw new Error('suena hasta con el dado en el techo');
  if (!suenaElMorse(0)) throw new Error('no suena ni con el dado en el piso');
});

caso('el morse y el relator nunca suenan juntos', () => {
  // Ocupan el mismo segundo y medio despues de que la pelota entra: encimados no se entiende
  // ninguno de los dos. Se comprueba en la pantalla, que es donde se decide.
  const juntos = /hayRelatoEnIngles[\s\S]{0,140}?else if \(suenaElMorse/;
  if (!juntos.test(PANTALLA)) throw new Error('el morse no esta encadenado al relato con un else: pueden sonar los dos');
});

caso('los archivos del grito existen', () => {
  for (const f of ['relato_gol_1.mp3', 'relato_gol_2.mp3', 'gol_morse.mp3', 'pase.mp3']) {
    if (!existsSync(`public/sfx/${f}`)) throw new Error(`falta public/sfx/${f}`);
  }
  if (!/CHANCE_DEL_MORSE/.test(readFileSync('src/relatoDelGol.ts', 'utf8'))) throw new Error('la regla del morse no existe');
  void CHANCE_DEL_MORSE;
});


// ==================================================================================================
// LAS PANTALLAS QUE NO PUEDEN QUEDAR MUDAS
// ==================================================================================================
//
// Reportado: "hay partidos donde no se escucha". Eran los SIMULADOS: esa pantalla no tenia un solo
// playSfx, asi que tocar "Simular" daba un partido en silencio absoluto mientras el jugado sonaba a
// cancha llena. Y lo mismo pasaba con las tres tapas de diario, justo despues de noventa minutos de
// estadio -- ahi el silencio se nota mas que el sonido.

caso('simular un partido no es mudo', () => {
  const pantalla = readFileSync('src/components/PartidoSimulandose.tsx', 'utf8');
  if (!/playSfx\(/.test(pantalla)) throw new Error('la pantalla de simular no dispara ningun sonido');
});

caso('las tres tapas de diario suenan al abrir', () => {
  for (const [archivo, que] of [
    ['src/components/PostMatch.tsx', 'la de despues del partido'],
    ['src/components/NewSeasonOverlay.tsx', 'la de arranque de temporada'],
    ['src/components/PortadaDeFichaje.tsx', 'la del fichaje'],
  ]) {
    const fuente = readFileSync(archivo, 'utf8');
    if (!/playSfx\('post_partido'\)/.test(fuente)) throw new Error(`${que} abre en silencio`);
  }
});

caso('rebobinar un efecto no puede tirar en medio del partido', () => {
  // Asignar `currentTime` sobre un audio que todavia no cargo los metadatos TIRA, y ese throw es
  // sincrono: el .catch() de play() no lo agarra y la excepcion se lleva puesto el tick del
  // partido. Con los placeholders .wav no pasaba (pesaban cuatro kilos); con los mp3 reales si.
  const audio = readFileSync('src/audio.ts', 'utf8');
  if (!/try \{[\s\S]{0,120}?currentTime = 0;[\s\S]{0,80}?\} catch/.test(audio)) {
    throw new Error('el rebobinado no esta protegido: una excepcion ahi corta el partido');
  }
});


caso('NADA suena por fuera del boton de volumen', () => {
  // La invariante que hace que el boton sirva: todo el audio del juego pasa por src/audio.ts (que
  // corta en seco si esta muteado) o por src/ambienteDelPartido.ts (que lee el mismo volumen en
  // cada latido). El dia que alguien agregue un `new Audio()` en un componente, ese sonido se le
  // escapa al boton y el jugador aprieta silencio y sigue escuchando algo -- que es peor que no
  // tener boton.
  const raiz = 'src';
  const permitidos = ['src/audio.ts', 'src/ambienteDelPartido.ts'];
  const sospechosos: string[] = [];
  const recorrer = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const ruta = `${dir}/${e.name}`;
      if (e.isDirectory()) { recorrer(ruta); continue; }
      if (!/\.(ts|tsx)$/.test(e.name)) continue;
      if (permitidos.includes(ruta)) continue;
      const t = readFileSync(ruta, 'utf8');
      if (/new Audio\(/.test(t)) sospechosos.push(`${ruta} crea un Audio propio`);
      // `.play()` a secas: se excluye el de los videos y el de una promesa cualquiera mirando que
      // sea sobre un elemento de audio.
      if (/audio[A-Za-z]*\.play\(\)/.test(t)) sospechosos.push(`${ruta} reproduce audio por su cuenta`);
    }
  };
  recorrer(raiz);
  if (sospechosos.length) throw new Error(sospechosos.join('; '));
});

caso('el boton apaga TODO: los 15 efectos y el estadio', () => {
  const audio = readFileSync('src/audio.ts', 'utf8');
  // Un solo portero al principio de playSfx: si esta muteado o el volumen es cero, no suena nada.
  if (!/if \(prefs\.sfxMuted \|\| prefs\.sfxVolume <= 0\) return;/.test(audio)) {
    throw new Error('playSfx dejo de mirar el mute: algun efecto sonaria en silencio');
  }
  // Y el ambiente, que no pasa por playSfx, mira lo mismo.
  if (!/isSfxMuted\(\)\) return 0;/.test(FUENTE)) {
    throw new Error('el estadio no se apaga con el boton');
  }
});

console.log(fallas === 0
  ? '\nEl estadio suena durante el partido, se intercala y se apaga cuando tiene que apagarse.'
  : `\n${fallas} FALLAS`);
process.exit(fallas === 0 ? 0 : 1);
