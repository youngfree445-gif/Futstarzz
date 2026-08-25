// Baja el escudo de cada selección a public/badges/selecciones/ y genera el mapa que los usa.
//
//   node scripts/generar_escudos_seleccion.mjs
//
// POR QUE
//
// Las selecciones se dibujaban con las INICIALES de su nombre -- "SDA" para Selección de Alemania --
// en la tarjeta del partido, en el marcador y en las tablas. La causa: buildNationalTeam (data.ts)
// les pone `badgeLogoUrl` (una bandera emoji) pero nunca `badgeImageUrl`, que es el único campo que
// ClubBadge dibuja como imagen, y con colorFallback el emoji ni siquiera se muestra.
//
// EL ESCUDO SE BAJA, NO SE ENLAZA. Los archivos del juego no tienen escudos de selección sueltos:
// football-logos-main/logos/*.png son mosaicos con decenas de clubes de cada país, no el escudo de
// la federación. Lo único que había era la URL en src/national_teams.json. Así que se baja una vez
// y queda en public/, igual que public/badges/tm/ -- el juego tiene que verse bien sin depender de
// que un CDN ajeno siga sirviendo la imagen (ni de tener internet).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const DESTINO = 'public/badges/selecciones';
const selecciones = JSON.parse(readFileSync('src/national_teams.json', 'utf8'));
const data = readFileSync('src/data.ts', 'utf8');

// Los ids y nombres del juego, tal como los declara data.ts.
const bloque = data.slice(data.indexOf('WORLD_CUP_2026_TEAMS_SEED'));
const equipos = [...bloque.matchAll(/\{ id: '([^']+)', countryName: '([^']+)'/g)]
  .map(m => ({ id: m[1], pais: m[2] }));

// Cómo se llama cada país en la fuente. Sólo los que NO coinciden tal cual.
const EN_INGLES = {
  'Alemania': 'Germany', 'Canadá': 'Canada', 'México': 'Mexico', 'Estados Unidos': 'United States',
  'Curazao': 'Curacao', 'Haití': 'Haiti', 'Panamá': 'Panama', 'Brasil': 'Brazil',
  'Nueva Zelanda': 'New Zealand', 'Irak': 'Iraq', 'Irán': 'Iran', 'Japón': 'Japan',
  'Jordania': 'Jordan', 'Corea del Sur': 'Korea, South', 'Catar': 'Qatar',
  'Arabia Saudita': 'Saudi Arabia', 'Uzbekistán': 'Uzbekistan', 'Argelia': 'Algeria',
  'Cabo Verde': 'Cape Verde', 'RD Congo': 'DR Congo', 'Costa de Marfil': "Cote d'Ivoire",
  'Egipto': 'Egypt', 'Marruecos': 'Morocco', 'Sudáfrica': 'South Africa', 'Túnez': 'Tunisia',
  'Bélgica': 'Belgium', 'Bosnia y Herzegovina': 'Bosnia-Herzegovina', 'Croacia': 'Croatia',
  'Chequia': 'Czech Republic', 'República Checa': 'Czech Republic', 'Inglaterra': 'England',
  'Francia': 'France', 'Holanda': 'Netherlands', 'Noruega': 'Norway', 'Escocia': 'Scotland',
  'España': 'Spain', 'Suecia': 'Sweden', 'Suiza': 'Switzerland', 'Türkiye': 'Turkey',
  'Italia': 'Italy', 'Dinamarca': 'Denmark', 'Polonia': 'Poland', 'Ucrania': 'Ukraine',
  'Hungría': 'Hungary', 'Rumania': 'Romania', 'Eslovaquia': 'Slovakia', 'Eslovenia': 'Slovenia',
  'Perú': 'Peru', 'Gales': 'Wales', 'Irlanda': 'Ireland', 'Irlanda del Norte': 'Northern Ireland',
  'Grecia': 'Greece', 'Islandia': 'Iceland', 'Finlandia': 'Finland',
  'Macedonia del Norte': 'North Macedonia', 'Bielorrusia': 'Belarus', 'Kazajistán': 'Kazakhstan',
  'Azerbaiyán': 'Azerbaijan', 'Moldavia': 'Moldova', 'Letonia': 'Latvia', 'Lituania': 'Lithuania',
  'Chipre': 'Cyprus', 'Luxemburgo': 'Luxembourg', 'Islas Feroe': 'Faroe Islands',
};

const sinAcentos = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const porNombre = new Map();
for (const s of selecciones) {
  if (!s.team_image_url) continue;
  for (const n of [s.name, s.country_name]) {
    if (n && !porNombre.has(sinAcentos(n))) porNombre.set(sinAcentos(n), s.team_image_url);
  }
}

if (!existsSync(DESTINO)) mkdirSync(DESTINO, { recursive: true });

const encontrados = [];
const faltantes = [];
const fallidos = [];

for (const eq of equipos) {
  const candidatos = [EN_INGLES[eq.pais], eq.pais].filter(Boolean).map(sinAcentos);
  const url = candidatos.map(c => porNombre.get(c)).find(Boolean);
  if (!url) { faltantes.push(eq); continue; }

  const archivo = `${DESTINO}/${eq.id}.png`;
  if (!existsSync(archivo)) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const buf = Buffer.from(await r.arrayBuffer());
      // Transfermarkt contesta 200 con cuerpo vacío cuando bloquea: un PNG de verdad pesa miles.
      if (!r.ok || buf.length < 500) { fallidos.push({ ...eq, motivo: `${r.status}, ${buf.length} bytes` }); continue; }
      writeFileSync(archivo, buf);
      await new Promise(res => setTimeout(res, 120));   // sin apurar al servidor
    } catch (e) {
      fallidos.push({ ...eq, motivo: String(e.message ?? e) });
      continue;
    }
  }
  encontrados.push(eq);
}

const lineas = encontrados
  .map(e => `  ${e.id}: 'badges/selecciones/${e.id}.png',${' '.repeat(Math.max(1, 34 - e.id.length))}// ${e.pais}`)
  .join('\n');

writeFileSync('src/escudosDeSeleccion.ts', `// GENERADO por scripts/generar_escudos_seleccion.mjs -- no editar a mano.
//
// El escudo de cada selección, servido desde public/badges/selecciones/ (archivos propios, no
// enlaces a un CDN ajeno: el juego se ve igual sin internet y no depende de que Transfermarkt
// siga sirviendo la imagen).
//
// Existe porque las selecciones se dibujaban con las INICIALES de su nombre -- "SDA" para
// Selección de Alemania. buildNationalTeam les ponía \`badgeLogoUrl\` (bandera emoji) pero nunca
// \`badgeImageUrl\`, que es el único campo que ClubBadge dibuja como imagen.
//
// Va aparte de data.ts porque los escudos de CLUB no se tocan por ningún motivo (regla del
// proyecto), y así este mapa se regenera solo cuando se agreguen selecciones.

/** Escudo de cada selección, por su id en el juego. Ruta relativa: la resuelve ClubBadge. */
export const ESCUDO_DE_SELECCION: Readonly<Record<string, string>> = {
${lineas}
};
`, 'utf8');

console.log(`${encontrados.length} selecciones con escudo en ${DESTINO}/`);
if (faltantes.length) console.log(`  sin URL en national_teams.json (${faltantes.length}): ${faltantes.map(f => f.pais).join(', ')}`);
if (fallidos.length) console.log(`  no se pudieron bajar (${fallidos.length}): ${fallidos.map(f => `${f.pais} (${f.motivo})`).join(', ')}`);
