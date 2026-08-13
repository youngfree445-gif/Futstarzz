/**
 * Le baja una foto a cada artículo de la Tienda de Lujos y la deja enganchada en data.ts.
 *
 *   node scripts/bajar_fotos_tienda.mjs          (sólo los que no tienen foto)
 *   node scripts/bajar_fotos_tienda.mjs --todas  (rehace también las que ya están)
 *
 * ---------------------------------------------------------------------------------------------
 * DE DÓNDE SALEN
 * ---------------------------------------------------------------------------------------------
 *
 * De loremflickr.com, que sirve fotos de Flickr filtradas por licencia Creative Commons y las
 * elige POR PALABRA CLAVE. Eso último es lo que importa: un servicio de fotos al azar (picsum y
 * compañía) devuelve paisajes bonitos que no tienen nada que ver con lo que se vende, y una tarjeta
 * de "Carrito de Comidas Callejero" con la foto de una montaña se ve peor que sin foto.
 *
 * Se probó primero source.unsplash.com, que es lo que se usó para las seis fotos originales en
 * julio, y hoy devuelve 503: el servicio quedó discontinuado.
 *
 * El `lock` del final de la URL fija QUÉ foto trae para esa palabra. Sin él, cada corrida bajaría
 * una imagen distinta y la tienda cambiaría de cara sola en cada build. Con él, el resultado es
 * reproducible: dos personas que corren este script obtienen exactamente las mismas fotos.
 *
 * ---------------------------------------------------------------------------------------------
 * QUÉ TOCA
 * ---------------------------------------------------------------------------------------------
 *
 * Escribe los .jpg en src/assets/shop/ y agrega a data.ts el import y el `image:` de cada artículo
 * que haya conseguido foto. Lo que ya tenía imagen NO se toca (las seis originales quedan como
 * están). Si una descarga falla, ese artículo se queda sin foto y cae al ícono, que es un camino
 * que la tienda ya soporta -- nunca deja el código a medias.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { get } from 'node:https';

const TODAS = process.argv.includes('--todas');
const CARPETA = 'src/assets/shop';
const DATA = 'src/data.ts';

/**
 * Palabra clave por artículo. Escritas a mano y en inglés porque el banco de fotos indexa así, y
 * elegidas para que la foto se entienda SIN leer el nombre: "street food cart" trae un carrito de
 * verdad, "cart" solo trae changuitos de supermercado.
 */
const BUSQUEDA = {
  // equipo personal
  pro_boots: 'football,boots', sneaker_collection: 'sneakers,collection', smartphone: 'smartphone',
  tablet_analysis: 'ipad', headphones: 'headphones', luxury_watch: 'luxury,watch',
  jewelry_set: 'diamond,jewelry', gaming_setup: 'gaming,setup', home_cinema: 'home,cinema',
  camera_kit: 'camera,lens', mountain_bike: 'mountain,bike', motorcycle: 'motorcycle',
  recovery_pod: 'cryotherapy', personal_chef: 'chef,kitchen', private_trainer_team: 'sports,training',
  // vehículos
  city_hatchback: 'hatchback,car', pickup_4x4: 'pickup,truck', luxury_sedan: 'luxury,sedan',
  classic_collection: 'classic,car', hypercar: 'supercar',
  // viviendas
  city_apartment: 'apartment,building', family_house: 'family,house', penthouse: 'penthouse',
  beach_villa: 'beach,villa', mountain_estate: 'mountain,ranch', private_island: 'tropical,island',
  // aviación y náutica
  helicopter: 'helicopter', yacht: 'yacht', private_jet: 'private,jet',
  // gastronomía
  food_cart: 'street,food,cart', food_truck: 'food,truck', sports_bar: 'beer,pub',
  restaurant: 'restaurant,interior', restaurant_chain: 'restaurant,chain',
  // empresas
  esports_team: 'esports,arena', football_academy: 'youth,football,training', gym_chain: 'gym',
  clothing_brand: 'clothing,store', game_studio: 'video,game,studio',
  real_estate_firm: 'construction,skyline', media_network: 'tv,studio', tech_startup: 'startup,office',
  stadium_naming: 'football,stadium', club_ownership: 'football,stadium,crowd',
};

const bajar = (url, saltos = 0) => new Promise((resolve, reject) => {
  if (saltos > 5) return reject(new Error('demasiadas redirecciones'));
  get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    // loremflickr redirige a su CDN, así que hay que seguir la cadena a mano.
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      res.resume();
      const destino = res.headers.location.startsWith('http')
        ? res.headers.location
        : new URL(res.headers.location, url).toString();
      return resolve(bajar(destino, saltos + 1));
    }
    if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
    const trozos = [];
    res.on('data', t => trozos.push(t));
    res.on('end', () => resolve(Buffer.concat(trozos)));
  }).on('error', reject);
});

await mkdir(CARPETA, { recursive: true });
let src = await readFile(DATA, 'utf8');

const conseguidas = [];
const fallidas = [];
for (const [id, palabras] of Object.entries(BUSQUEDA)) {
  const destino = `${CARPETA}/${id}.jpg`;
  if (!TODAS && existsSync(destino)) { conseguidas.push(id); continue; }
  // `lock` fija la foto: sin él la tienda cambiaría de cara en cada corrida.
  const url = `https://loremflickr.com/800/600/${palabras}?lock=${id.length * 7 + 13}`;
  try {
    const datos = await bajar(url);
    if (datos.length < 5000) throw new Error('imagen sospechosamente chica (' + datos.length + ' bytes)');
    await writeFile(destino, datos);
    conseguidas.push(id);
    console.log(`  OK    ${id.padEnd(24)} ${(datos.length / 1024).toFixed(0)} KB   [${palabras}]`);
  } catch (e) {
    fallidas.push(id);
    console.log(`  FALLA ${id.padEnd(24)} ${e.message}`);
  }
}

// --- Enganchar en data.ts: un import por foto y el `image:` de cada artículo -------------------
const camel = id => id.replace(/_(\w)/g, (_, c) => c.toUpperCase()) + 'Img';
let imports = '';
let enganchados = 0;

for (const id of conseguidas) {
  const variable = camel(id);
  if (!src.includes(`import ${variable} from`)) {
    imports += `import ${variable} from './assets/shop/${id}.jpg';\n`;
  }
  // Se le agrega `image:` sólo si el artículo todavía no tiene uno. El bloque de cada artículo se
  // recorta por índice y no con un regex sobre todo el archivo: son 50 objetos parecidos y un
  // regex goloso pisa el artículo equivocado.
  const i = src.indexOf(`id: '${id}',`);
  if (i < 0) continue;
  const fin = src.indexOf('\n  },', i);
  if (fin < 0) continue;
  const bloque = src.slice(i, fin);
  if (bloque.includes('image:')) continue;
  const conFoto = bloque.replace(/(\n    icon: '[^']*')/, `$1,\n    image: ${variable}`);
  if (conFoto === bloque) continue;
  src = src.slice(0, i) + conFoto + src.slice(fin);
  enganchados++;
}

if (imports) {
  // Después del último import de assets, para no romper el orden del archivo.
  const ancla = src.lastIndexOf("from './assets/shop/");
  const finLinea = src.indexOf('\n', ancla) + 1;
  src = src.slice(0, finLinea) + imports + src.slice(finLinea);
}

await writeFile(DATA, src, 'utf8');
console.log(`\n${conseguidas.length} fotos listas, ${fallidas.length} fallidas, ${enganchados} artículos enganchados en data.ts`);
if (fallidas.length) console.log('sin foto (caen al ícono):', fallidas.join(', '));
