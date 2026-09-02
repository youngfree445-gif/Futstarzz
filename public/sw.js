/**
 * Service worker de Fut Starzz. Es lo que convierte la web en una app instalable que anda sin
 * internet.
 *
 * ---------------------------------------------------------------------------------------------
 * POR QUE ESTA ESTRATEGIA Y NO OTRA
 * ---------------------------------------------------------------------------------------------
 *
 * El juego corre ENTERO en el cliente: no hay servidor propio, las partidas van a localStorage y lo
 * unico externo son los GIFs del feed, que ya fallan en silencio sin conexion. Osea que para andar
 * offline alcanza con tener guardados los archivos del build.
 *
 * Se usan DOS politicas distintas, y la diferencia importa:
 *
 *   . /assets/* -> CACHE PRIMERO. Vite le pone un hash al nombre segun el contenido, asi que un
 *     archivo con ese nombre nunca cambia: si esta guardado, sirve. Cambio de contenido = nombre
 *     nuevo = descarga nueva. Cachearlos para siempre es correcto por construccion.
 *
 *   . index.html -> RED PRIMERO, cache como respaldo. Ese SI cambia en cada build y es el que dice
 *     que archivos con hash cargar. Servirlo desde cache sin preguntar es exactamente como se llega
 *     a la pantalla en blanco: el html viejo pide un JS que ya no existe. Es el mismo problema que
 *     documentan netlify.toml y public/_headers, resuelto acá para el caso offline.
 *
 * VERSION: al subirla, el `activate` borra los caches viejos. Hay que subirla en cada deploy que
 * cambie algo, o el service worker seguiria sirviendo el build anterior para siempre.
 */
const VERSION = 'futstarzz-v2';
const CACHE_ESTATICO = `${VERSION}-estatico`;

// Al instalar no se precachea nada mas que el arranque: el build son 34 MB (casi todo escudos y
// fotos de la tienda) y bajarlos de golpe en la instalacion haria que la app tarde un minuto en
// quedar lista. Se van guardando a medida que se usan, que para un juego de un solo jugador es
// suficiente: despues del primer partido ya esta todo lo que hace falta.
self.addEventListener('install', evento => {
  self.skipWaiting();
  evento.waitUntil(caches.open(CACHE_ESTATICO));
});

self.addEventListener('activate', evento => {
  evento.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.filter(n => !n.startsWith(VERSION)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', evento => {
  const pedido = evento.request;
  if (pedido.method !== 'GET') return;

  const url = new URL(pedido.url);
  // Solo lo de este mismo origen. Los GIFs de Giphy y cualquier otra cosa de afuera pasan derecho:
  // guardarlos no aporta y ensuciaria el cache con respuestas que ni siquiera controlamos.
  if (url.origin !== self.location.origin) return;

  const esDocumento = pedido.mode === 'navigate' || url.pathname.endsWith('.html');

  if (esDocumento) {
    // RED PRIMERO. Si no hay conexion, se sirve la ultima copia buena.
    evento.respondWith((async () => {
      try {
        const respuesta = await fetch(pedido);
        const cache = await caches.open(CACHE_ESTATICO);
        cache.put(pedido, respuesta.clone());
        return respuesta;
      } catch {
        const guardada = await caches.match(pedido);
        return guardada ?? caches.match('index.html') ?? Response.error();
      }
    })());
    return;
  }

  // CACHE PRIMERO para todo lo demas (JS, CSS, imagenes, sonidos).
  evento.respondWith((async () => {
    const guardada = await caches.match(pedido);
    if (guardada) return guardada;
    try {
      const respuesta = await fetch(pedido);
      // Solo se guardan las respuestas completas y validas: una 206 (rango parcial, tipica de los
      // audios) no se puede reusar despues y romperia la reproduccion offline.
      if (respuesta.ok && respuesta.status === 200) {
        const cache = await caches.open(CACHE_ESTATICO);
        cache.put(pedido, respuesta.clone());
      }
      return respuesta;
    } catch {
      return Response.error();
    }
  })());
});
