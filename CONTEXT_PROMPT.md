# Prompt de contexto — Fut Starzz 2026

> Pegá todo este archivo al arranque de una conversación nueva en claude.ai
> (la versión web no tiene acceso a este repo ni memoria de conversaciones
> anteriores) para que Claude entienda el proyecto sin que se lo tengas que
> re-explicar. Si la pregunta es sobre un archivo puntual, pegá también el
> contenido de ese archivo — esto es solo el mapa general.

> **Si vas a tocar datos, scraping, planteles o reglamentos: leé primero
> `docs/PROMPT_DATOS_Y_SCRAPING.md`.** Tiene las recetas que ya funcionan
> (ESPN, Transfermarkt, X), las trampas resueltas, la regla de homónimos y la
> lista viva de lo que falta.

Estás ayudando con **Fut Starzz 2026**, un simulador de
carrera futbolística estilo "modo carrera" de FIFA/EA FC: el usuario crea un
jugador, elige club y va jugando semana a semana (partidos con decisiones
tácticas, prensa, redes sociales, patrocinios, fichajes, selección
nacional), mientras TODAS las ligas del juego (no solo la del usuario)
corren su calendario y tabla en simultáneo de fondo.

## Stack

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4
- `lucide-react` (íconos), `motion` (animaciones), `xlsx` (import de datos)
- **Capacitor 8** para empaquetar como app Android/iOS nativa
- Deploy web: GitHub Pages (`npm run deploy`) — el juego es 100% frontend,
  sin backend ni base de datos; todo el estado vive en memoria + localStorage

## Mapa de archivos (todo bajo `src/`)

- `App.tsx` (~1200 líneas) — máquina de estados de pantallas
  (`welcome` → `setup` → `dashboard` → `match` → `post_match` / `event` /
  `penalty_shootout` → `career_summary`), y toda la lógica de avanzar semana
- `leagueEngine.ts` (~1500 líneas) — el motor: calendario, tablas, formato
  Apertura/Clausura, copas continentales, Champions/Europa, Mundial,
  ventanas de fichaje, mapeo semana↔fecha real. **Es el corazón del juego.**
- `data.ts` (~4100 líneas) — la base de datos completa: clubes, eventos
  aleatorios, preguntas de prensa, ítems de tienda/patrocinios, selecciones
  del Mundial. Es contenido, no lógica.
- `types.ts` — todos los tipos/interfaces compartidos
- `components/` — `Dashboard.tsx` (hub principal, tablas, redes sociales),
  `MatchSimulator.tsx`, `DecisionCenter.tsx` (eventos random), `PostMatch.tsx`,
  `PenaltyShootout.tsx`, `SetupScreen.tsx`, `WelcomeScreen.tsx`,
  `CareerSummary.tsx`, `ClubBadge.tsx`
- `soccerDatabase.ts`, `clubExtras.ts` — datos auxiliares de clubes
- `audio.ts` — motor de SFX (gol, tarjeta, silbato). Archivos en `public/sfx/`,
  ver [docs/SFX.md](docs/SFX.md)
- `musicPlaylist.ts` + `components/MusicPlayer.tsx` — widget flotante de música:
  el jugador pega su playlist de Spotify/YouTube y suena mientras juega

## Audio: dos capas que no se pueden mezclar

- **SFX (`audio.ts`)** — archivos nuestros en `public/sfx/`, así que el juego los
  dispara en el momento exacto (gol, tarjeta, silbatazo). Es la capa que da la
  sensación tipo FIFA. El volumen/mute se persisten en `localStorage`.
- **Música (`MusicPlayer.tsx`)** — playlist del jugador embebida en un iframe.
  Los dos providers no son equivalentes y la UI los trata distinto a propósito:
  - **YouTube** (recomendado): canciones completas y encadenadas. Se controla por
    `postMessage` (IFrame API), así que el iframe se colapsa a 1x1px y sigue
    sonando de fondo con play/pausa/siguiente/volumen propios en el widget.
    Colapsar con `display:none` o `width:0` **no sirve**: varios navegadores
    pausan un iframe realmente oculto. Va a 1px con `opacity:.01`.
    El embed usa `www.youtube.com`, **no** `youtube-nocookie.com`: el dominio sin
    cookies rechaza muchas playlists de YouTube Music (los mixes `RD...` quedan
    en negro con "video no disponible").
  - **Spotify**: su embed solo da **previews de 30s** salvo que el visitante
    tenga sesión Premium en el navegador, y no expone API de control. No se
    arregla desde acá (haría falta el Web Playback SDK: OAuth + Premium por
    jugador), así que su reproductor queda visible y la limitación se avisa en la
    UI.
  - Igual **no se puede mezclar** ninguno de los dos con el audio del juego: es
    otro dominio y same-origin lo impide, así que no hay forma de bajar la música
    automáticamente en un gol. De ahí que haya dos sliders separados y que el de
    efectos diga explícitamente "efectos del partido".
- Los navegadores **bloquean el audio hasta el primer gesto del usuario**
  (autoplay policy). No se puede esquivar: `playSfx` falla en silencio a
  propósito, y el silbatazo inicial puede no sonar si el jugador entró directo a
  un partido sin haber clickeado nada antes en esa carga.
- El widget se monta en `App.tsx` junto a los toasts, **fuera** de los bloques
  por pantalla: si viviera dentro de `Dashboard` o `MatchSimulator`, cambiar de
  pantalla recrearía el iframe y cortaría la canción.
- Las rutas de los sfx se arman con `import.meta.env.BASE_URL`, no absolutas:
  los tres destinos tienen bases distintas (`/`, `/Futstarzz/`, `./`).

## Calendario: UNA sola fuente de verdad (leer esto antes de tocar nada)

**Un "paso" (`currentWeek`) es una FECHA CON PARTIDO, no una semana.** Si el
club juega liga el domingo y copa el jueves, son dos pasos distintos.

Hubo tres sistemas de calendario conviviendo, cada uno con su reloj, y la tabla
la armaba uno distinto del que decidía tu partido. **Quedó solo el primero:**

| Sistema | Estado |
|---|---|
| `realCalendarDates.ts` + `dateSchedule.ts` (por FECHAS) | ✅ el único |
| `realCalendar.ts` / `realSchedule.ts` (por semanas+jornadas) | ❌ eliminado |
| Generador sintético de round-robin | ❌ ya no decide partidos |

- **`src/seasonCalendar.ts`**: genera las temporadas. La 1 es el calendario real
  tal cual; de la 2 en adelante reusa las MISMAS fechas corridas un año y
  resortea los emparejamientos **permutando los clubes** de la competición, con
  semilla determinista (`id de competición + temporada`). Permutar en vez de
  generar un fixture nuevo mantiene el calendario estructuralmente válido para
  cualquier formato (Apertura/Clausura, conferencias MLS, fechas impares).
  Vive en su propio módulo porque `leagueEngine` también lo necesita y
  `dateSchedule` ya importa de `leagueEngine` (importarlo al revés = ciclo).
- El calendario **no se acaba**: `MAX_TEMPORADAS = 32` (Flamengo llega a 1388
  pasos, hasta 2057).
- **`DatedFixture.temporada`**: `fixturesForClub` devuelve las 32 temporadas
  concatenadas. Todo lo que pregunte "el último partido de X" **tiene que
  filtrar por `temporada`**, o la respuesta cae en 2057. Ya mordió cuatro veces
  (`esUltimoPartidoDeLaCopa`, `esUltimaFechaDelTorneo`, `calendarioDeLigaAgotado`,
  `partidosDeLaMismaLlave`).
- La tabla la arma `resolveLigaPorFecha` (`leagueEngine`), que resuelve todo lo
  pendiente **hasta la fecha de hoy inclusive** — no solo los partidos del día,
  porque los otros clubes juegan en fechas en que el tuyo descansa. Cada fixture
  guarda `"fecha|local|visitante"` en `round` para no resolverse dos veces.
- Saves viejos (con `round` estilo `"5. Matchday"`) se detectan y la temporada
  arranca de cero, poniéndose al día sola en el mismo paso.

- `SEASON_LENGTH_WEEKS = 52` e `isCupWeek` siguen existiendo pero **ya no
  deciden qué partido jugás**: solo alimentan cosas cosméticas y el fixture
  sintético de clubes sin calendario real. Sí decide **en qué temporada estás**:
  `getSeasonYear` divide `currentWeek` por 52, así que la temporada 2 arranca en
  el paso 53 — es el número que mira el reparto de cupos continentales.
- Día 1 de la carrera = **12 de enero de 2026** (`CAREER_START_DATE`).
- Ventanas de fichaje: semanas 1-7 y 19-22 de cada temporada, pensadas
  para calzar con enero / mitad de año reales.
- Dos motores de liga, elegidos por país (`isApeturaClausuraLeague`):
  - **Motor simple** (la mayoría de ligas): tabla larga ida y vuelta.
  - **Apertura/Clausura** (Colombia y Argentina): todos-contra-todos a una
    vuelta (19 fechas Colombia / 14 Argentina) → top 8 → playoffs, **dos
    veces por año** (semestre 1 = Apertura, semestre 2 = Clausura).
    - Colombia: playoffs = **Cuartos, Semifinal y Final, TODO a ida y
      vuelta** (formato real vigente desde 2024) — `twoLegKnockout` en
      `LeagueSeasonState`.
    - Argentina: playoffs a partido único (simplificación deliberada) —
      `knockout` en `LeagueSeasonState`.
- Copas continentales: Libertadores/Sudamericana (Conmebol, grupos de 4 +
  eliminación directa) y Champions/Europa League (UEFA, fase de liga estilo
  Swiss + playoff + eliminación a ida y vuelta desde octavos).
  - **Conmebol** (`src/copasConmebol.ts`): la temporada 1 son los **32 clubes
    reales** de la fase de grupos de cada copa en 2026, bajados de Transfermarkt
    y resueltos **por ID, nunca por nombre** (emparejar por texto mandaba
    "Racing Club" al Racing uruguayo en vez del de Avellaneda, y "Atlético-MG"
    al Atlético FC ecuatoriano). De la temporada 2 en adelante los cupos se
    ganan: se reparten los mismos cupos por país usando `posicionesFinales`
    (la tabla final del año anterior), y los dos campeones vigentes entran a la
    Libertadores dentro de la cuota de su país — sumarlos aparte pasaba de 32 y
    el recorte dejaba a Venezuela sin representante.
  - **UEFA** (`src/copasUefa.ts`): mismo criterio. Temporada 1 = los **36 clubes
    reales** de la fase de liga 2025/26 de cada copa; temporada 2+ por tabla, con
    el campeón vigente entrando dentro de la cuota de su liga. El código de la
    Champions en Transfermarkt es **`CL`**, no `C1` (`C1` es otra competición y
    devuelve un palmarés sin partidos); `CL` responde 503 si se lo pide seguido,
    hay que reintentar con espera.
- Mundial cada 4 años, 48 selecciones, formato real 2026 (grupos → ronda de
  32 → ... → final), todo a partido único. El de 2026 (año 1) usa el **sorteo
  real**: `src/mundialReal.ts` saca los 12 grupos de `src/schedule_2026.json`
  (los 72 partidos reales, que estaban en el repo sin que nadie los importara)
  deduciéndolos de quién juega contra quién. Antes se sorteaba al azar y
  Argentina podía cruzarse con Brasil en fase de grupos. Los Mundiales
  siguientes **sí** se sortean: no simulamos eliminatorias, así que no hay forma
  de saber quién clasificaría a 2030.
- Todo el catch-up (ligas/copas que el jugador no visitó en un rato) es
  perezoso: `getOrCreate*State` simula de golpe los pasos que faltan la
  primera vez que hace falta esa liga/copa.

## Empaquetado móvil (Capacitor)

- `npm run build` / `build:netlify` → `dist/` (Netlify, `base: '/'`)
- `npm run build:ghpages` / `deploy` → `dist-ghpages/` (Pages, `base: '/Futstarzz/'`)
- `npm run build:capacitor` / `npm run cap:sync` → `dist-mobile/` → se copia
  a `android/app/src/main/assets/public` e `ios/App/App/public` (`base: './'`)
- **Los tres builds están aislados** (`vite.config.ts` decide `outDir` y `base`
  según `CAPACITOR` / `GH_PAGES`): compilar un destino nunca pisa a los otros,
  aunque comparten el mismo código fuente React. Antes Pages y Netlify
  compartían `dist/`, y como el build de Pages prefija los assets con
  `/Futstarzz/`, correr `deploy` dejaba en `dist/` un build que en Netlify da
  404 en todo → pantalla en blanco.

### Netlify se sube arrastrando la carpeta a mano

A Netlify se le sube `dist/` con drag & drop, **no** desde el repo. Dos
consecuencias que hay que tener presentes:

- `netlify.toml` **no se aplica** (Netlify solo lo lee cuando buildea él
  mismo). Las reglas de caché viven además en `public/_headers`, que sí viaja
  dentro de `dist/` y por eso sigue funcionando con drag & drop.
- Como la subida es manual, nada valida que `dist/` sea el build correcto: por
  eso importa que cada destino tenga su carpeta propia. Antes de arrastrar,
  `dist/index.html` tiene que pedir `/assets/...` — si dice `/Futstarzz/assets/...`
  es el build de Pages y va a quedar en blanco.
- Carpeta `android/` ya generada y funcional (Gradle + Capacitor 8); appId
  `com.futstarz.app`.

## Convenciones del repo

- Comentarios en español, explican el **por qué** (una regla real del
  fútbol que se está modelando o simplificando a propósito), nunca el qué —
  el código ya es legible por sí solo.
- El repo va a quedar público: **no mencionar IA/Claude/Anthropic en
  comentarios ni commits**, ver commit `093a50e`.
- Sin backend: todo el estado corre en el cliente, se persiste a
  localStorage (`saveGameState` en `App.tsx`).
- Preferir extender los patrones ya existentes (`ShopItem`, `PressQuestion`,
  `effects: { prestige, fans, energy, capital }`) antes que inventar
  estructuras nuevas — ver `ROADMAP_FEATURES.md` para el criterio de diseño
  usado en cada fase ya construida.

## Estado actual (26 jul 2026)

- Fases 1, 2 y 3 del roadmap original ya implementadas (liga paralela,
  copas continentales reales, Mundial jugable, vicios/vestuario/prensa/
  patrocinios/salud mental/Modo Veterano).
- Empaquetado Android recién configurado y probado (compila y corre en
  dispositivo físico vía Gradle + adb).
- Últimos fixes: pantalla negra al resolver una decisión justo antes de una
  semana de fecha FIFA sin partido (faltaba volver a `setScreen('dashboard')`
  en `handleResolveEvent`), calendario reubicado a enero 2026, y playoffs de
  Colombia reescritos a ida y vuelta real (Cuartos/Semis/Final) para que no
  se repitan siempre los mismos cruces entre semestres.
- `App.tsx`/`startMatchflow`: durante semanas de copa (Libertadores/
  Sudamericana en fase de grupos, Champions/Europa en fase de liga) ahora sí
  se calcula la posición real en la tabla de grupo/fase de liga (antes
  quedaba siempre en `null` para cualquier semana de copa, así que ganar en
  Libertadores no se reflejaba ni en el marcador del partido ni en el
  `pressureMultiplier` — bug reportado y corregido).
- Dashboard: tarjeta de "próximo partido" simplificada (sin texto de relleno,
  solo escudo del rival, competición, posición en tabla si aplica y jornada
  en una esquina) y con botón "Pasar a Siguiente Fecha" cuando hay fecha FIFA
  sin convocatoria. Calendario mensual ahora conserva el historial de
  partidos jugados (V/E/D + marcador + escudo) además de los próximos, vía
  `getRealDateFor{League,Cup}StepsBehind` en `leagueEngine.ts`. ChutSocial
  suma posts de los periodistas reales de la Sala de Prensa (con foto) y un
  sistema de likes/comentarios local (el jugador puede comentar lo que
  quiera bajo su propio nombre).

## Pendientes conocidos (al 10 de agosto de 2026)

El calendario quedó bien. Falta esto:

1. **No existe pantalla de eliminación.** Solo está la de campeón. Cuando te
   eliminan de una copa no aparece nada. Falta esa pantalla y que el periódico
   de fin de temporada muestre "ELIMINADOS" en grande.

2. **Roster de Ligue 1 incompleto.** El calendario `fr1` trae 16 clubes y la liga
   tiene 18: faltan Angers y Metz. Por eso `angers_sco`, `estac_troyes` y
   `le_mans_fc` figuran en primera sin jugar un partido (PJ=0). No se tocaron
   porque la ausencia en un calendario incompleto no prueba nada; hay que
   reimportar Ligue 1 antes de decidir.

3. **Los dos calendarios de la Serie A se pisan.** Conviven `it1`
   (2025/26, que es la temporada en la que arranca la carrera) e `ita1`/`ita2`
   (2026/27). Los clubes italianos reciben partidos de **las dos** dentro de la
   temporada 1: el Cremonese junta 57 partidos entre "Serie A" y "Serie B". Las
   divisiones de `data.ts` están bien para 2025/26 — el problema es que sobra un
   calendario, no que falte corregir clubes.

## Los escudos remotos son la causa habitual de "no tiene escudo"

Los escudos viven de tres formas: archivo local en `public/badges/` (533 clubes),
hotlink remoto (297) y unos pocos embebidos. **Los remotos son frágiles.**
`assets.football-logos.cc` empezó a **bloquear el hotlinking y a devolver 403 en
todo**, y se llevó puestos 30 escudos de golpe — Bayern e Inter entre ellos. Ya
se bajaron todos a local (`d4bd7b9`). Los dos hosts que quedan
(`pub-*.r2.dev`, 258, y `upload.wikimedia.org`, 39) responden bien **por ahora**.

Ante un club sin escudo, lo primero es mirar si su `badgeImageUrl` es `https://`
y qué status devuelve. La solución es bajarlo a `public/badges/tm/` desde
Transfermarkt por **ID de club** (`tmssl.akamaized.net/images/wappen/head/<id>.png`).
El ID sale de `schnellsuche/ergebnis/schnellsuche?query=<nombre>`, en el `<img>`
con clase `suche-vereinswappen`; la fila trae la competición, que sirve para
elegir el equipo senior y no un filial o un juvenil.

**El nombre del archivo no dice de quién es el escudo**: `leon.png` tenía el del
Lens, `dorados.png` el del Colorado Rapids y `san_antonio.png` el de San Lorenzo.
Hay que abrir la imagen antes de dar nada por bueno.

Chequeo barato de sanidad, sobre los 1103 clubes: 0 rutas locales sin archivo,
0 rutas usadas por dos clubes y 0 archivos con el mismo md5. Los tres estaban en
cero al cerrar; si alguno sube, hay un escudo cruzado.

**Sin fuente:** `irapuato` no aparece en Transfermarkt con ninguna búsqueda, así
que quedó sin `badgeImageUrl` (cae a las iniciales). Falta el link.

## Una división mal puesta se ve como "falta el escudo"

Vale la pena tenerlo presente porque el síntoma no apunta al problema. El
Dashboard resuelve al rival del próximo partido entre los clubes de **tu liga y
tu división**. Si el calendario dice que jugás contra un club que en `data.ts`
figura en otra división, `resolverClubDeCalendario` devuelve `null`, y sin club
no hay `badgeImageUrl`: `ClubBadge` cae a la pelota genérica. El mismo desfase
es el que dejaba a esos clubes con PJ=0 en la tabla.

Pasó con Brasil (arreglado en `504ed83`: subían Chapecoense, Coritiba, Athletico
Paranaense y Remo; bajaban Fortaleza, Ceará, Sport y Juventude). **La forma
correcta de verificarlo es contra el calendario real** — los clubes de `bra1` y
`bra2` en `realCalendarDates.ts` — y no contra una lista escrita a mano.
