/**
 * RECORTA LOS MP3 DE AMBIENTE SIN DECODIFICARLOS.
 *
 *   node scripts/recortar_ambiente.mjs
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUÉ ESTO EXISTE Y NO SE USA FFMPEG
 * ---------------------------------------------------------------------------------------------
 *
 * En esta máquina no hay ffmpeg ni sox, así que no se puede decodificar un MP3. Pero para lo único
 * que hace falta acá -- quedarse con un tramo del medio -- NO hace falta decodificar nada: un MP3 es
 * una fila de frames independientes, cada uno con su cabecera que dice cuánto ocupa y cuánto dura.
 * Recortar es tirar los frames de antes y los de después, y escribir los del medio tal cual.
 *
 * Ventaja sobre re-codificar: el audio que queda es EXACTAMENTE el original, bit por bit. No hay
 * pérdida de una segunda pasada de compresión.
 *
 * Lo que NO se puede hacer así: fundidos ni normalizar volumen, porque eso sí requiere las muestras.
 * El fundido lo pone el juego en tiempo real (ver CRUCE en src/ambienteDelPartido.ts) y el volumen
 * se ajusta por pista con un multiplicador, así que ninguna de las dos hace falta acá.
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUÉ SE CORTA DEL MEDIO Y NO DEL PRINCIPIO
 * ---------------------------------------------------------------------------------------------
 *
 * Las grabaciones de multitud casi siempre empiezan con la gente entrando o con un silencio antes
 * del arranque, y terminan con el corte del que grababa. El medio es la parte pareja, que es
 * justamente la que sirve para un fondo que se repite.
 *
 * ---------------------------------------------------------------------------------------------
 * LA JUNTA DEL BUCLE
 * ---------------------------------------------------------------------------------------------
 *
 * Un frame de MP3 puede depender de datos del anterior (el "bit reservoir"), así que el primer
 * frame después de un corte puede sonar raro por unos milisegundos. En una multitud eso es
 * inaudible -- no hay tono ni ritmo que se corte -- y además el juego encadena la pista consigo
 * misma con un cruce de dos segundos y medio, que tapa la junta de todas formas.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { basename, dirname } from 'path';

const BR_MPEG1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
const BR_MPEG2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
const SR = { 3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000] };

/** Recorre los frames de un MP3 y devuelve, de cada uno, dónde empieza, cuánto ocupa y cuánto dura. */
function frames(datos) {
  let i = 0;
  // La etiqueta ID3v2 no es audio: se saltea entera.
  if (datos[0] === 0x49 && datos[1] === 0x44 && datos[2] === 0x33) {
    i = 10 + (((datos[6] & 0x7f) << 21) | ((datos[7] & 0x7f) << 14) | ((datos[8] & 0x7f) << 7) | (datos[9] & 0x7f));
  }
  const salida = [];
  while (i < datos.length - 4) {
    if (datos[i] === 0xFF && (datos[i + 1] & 0xE0) === 0xE0) {
      const ver = (datos[i + 1] >> 3) & 3;
      const capa = (datos[i + 1] >> 1) & 3;
      const bi = (datos[i + 2] >> 4) & 0xF;
      const si = (datos[i + 2] >> 2) & 3;
      const pad = (datos[i + 2] >> 1) & 1;
      if (ver !== 1 && capa === 1 && bi > 0 && bi < 15 && si < 3) {
        const br = (ver === 3 ? BR_MPEG1 : BR_MPEG2)[bi] * 1000;
        const sr = SR[ver][si];
        const largo = (ver === 3 ? Math.floor(144 * br / sr) : Math.floor(72 * br / sr)) + pad;
        if (largo > 4) {
          salida.push({ desde: i, largo, dura: (ver === 3 ? 1152 : 576) / sr });
          i += largo;
          continue;
        }
      }
    }
    i++;
  }
  return salida;
}

/** Escribe `segundos` del medio de `origen` en `destino`. */
function recortar(origen, destino, segundos) {
  const datos = readFileSync(origen);
  const fs = frames(datos);
  if (!fs.length) throw new Error(`${basename(origen)}: no encontré frames de MP3`);

  const total = fs.reduce((n, f) => n + f.dura, 0);
  // Si ya es más corto que el objetivo, se copia entero: recortar de menos no tiene sentido.
  if (total <= segundos) {
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, datos.subarray(fs[0].desde));
    return { total, quedo: total, bytes: datos.length - fs[0].desde };
  }

  // El tramo del medio.
  const sobra = total - segundos;
  const arranque = sobra / 2;
  let t = 0, i0 = 0, i1 = fs.length - 1;
  for (let i = 0; i < fs.length; i++) {
    t += fs[i].dura;
    if (t <= arranque) i0 = i + 1;
    if (t <= arranque + segundos) i1 = i;
  }
  const desde = fs[i0].desde;
  const hasta = fs[i1].desde + fs[i1].largo;
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, datos.subarray(desde, hasta));
  const quedo = fs.slice(i0, i1 + 1).reduce((n, f) => n + f.dura, 0);
  return { total, quedo, bytes: hasta - desde };
}

// ---------------------------------------------------------------------------------------------
// EL REPARTO POR REGIÓN
// ---------------------------------------------------------------------------------------------
//
// Se decide por el NOMBRE de cada archivo, no escuchándolo -- desde acá no se puede oír nada. Los
// nombres vienen de quien los grabó y son bastante explícitos ("barca", "boca-juniors",
// "fangesang", que es "canto de hinchada" en alemán). Si alguno quedó en la región equivocada, se
// mueve de lista acá y se vuelve a correr.
const AUDIOS = 'audios de partido';
const SALIDA = 'public/sfx/ambiente';

/** Cuántos segundos se queda cada pista. Alcanza de sobra para un fondo que se repite. */
const SEGUNDOS = 22;

const PLAN = [
  // LATAM: bombos, trompetas y cantos.
  [`${AUDIOS}/ambiente/freesound_community-018839_explosions-football39s-chants-in-street-celebration-in-the-boca-juniors-fan-national-day-12-12-2012-54413.mp3`, `${SALIDA}/latam_1.mp3`],
  [`${AUDIOS}/ambiente/freesound_community-football-party-people-in-the-streets-24170.mp3`, `${SALIDA}/latam_2.mp3`],
  // EUROPA: cantos de tribuna, más parejos.
  [`${AUDIOS}/ambiente/freesound_community-barca-58446.mp3`, `${SALIDA}/europa_1.mp3`],
  [`${AUDIOS}/ambiente/photografix-fangesang-260074.mp3`, `${SALIDA}/europa_2.mp3`],
  // GENERAL: multitud sin acento, sirve para cualquier cancha.
  [`${AUDIOS}/ambiente/freesound_community-football-crowd-3-69245.mp3`, `${SALIDA}/general_1.mp3`],
  [`${AUDIOS}/ambiente/vishiv-crowd-cheering-in-stadium-435357.mp3`, `${SALIDA}/general_2.mp3`],
  [`${AUDIOS}/ambiente/freesound_community-crazy-soccer-crowd-cheering-72194.mp3`, `${SALIDA}/general_3.mp3`],
  [`${AUDIOS}/con reacciones/freesound_community-football-game-in-a-big-arena-31575.mp3`, `${SALIDA}/general_4.mp3`],
  [`${AUDIOS}/con reacciones/arunangshubanerjee-live-football-match-stadium-crowd-cheering-563439.mp3`, `${SALIDA}/general_5.mp3`],
];

let antes = 0, despues = 0;
for (const [origen, destino] of PLAN) {
  if (!existsSync(origen)) {
    console.log(`FALTA  ${basename(origen).slice(0, 60)}`);
    continue;
  }
  antes += readFileSync(origen).length;
  const r = recortar(origen, destino, SEGUNDOS);
  despues += r.bytes;
  console.log(`${basename(destino).padEnd(14)} ${r.total.toFixed(0).padStart(4)}s -> ${r.quedo.toFixed(1).padStart(5)}s   ${(r.bytes / 1024).toFixed(0).padStart(4)} KB`);
}
console.log(`\nde ${(antes / 1024 / 1024).toFixed(1)} MB a ${(despues / 1024 / 1024).toFixed(1)} MB`);
